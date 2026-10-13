# Application Workflows

This document outlines the end-to-end sequences for core user journeys within HealthPath.

---

## Table of Contents
1. [User Authentication Flow](#1-user-authentication-flow)
2. [Doctor Appointment & Queue Tracker Flow](#2-doctor-appointment--queue-tracker-flow)
3. [Diagnostic Lab Booking Flow](#3-diagnostic-lab-booking-flow)
4. [Pharmacy Prescription & Medicine Order Flow](#4-pharmacy-prescription--medicine-order-flow)
5. [AI Health Assistant Consultation Flow](#5-ai-health-assistant-consultation-flow)
6. [Organ & Tissue Donation Pledge Flow](#6-organ--tissue-donation-pledge-flow)

---

### 1. User Authentication Flow

Handles user registration and credential-based login with IP-based rate limiting, schema validation, and salted password hashing.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as User / Patient
    participant FE as React Client (Login.jsx)
    participant Auth as Express Auth Route (/api/auth)
    participant DB as MongoDB (User Model)

    Patient->>FE: Enter Name, Email & Password (Register/Login)
    FE->>Auth: POST /api/auth/register or /api/auth/login
    Note over Auth: Rate Limit Check (10 req / 15 min per IP)<br/>Validation via express-validator
    Auth->>DB: Query User by Email
    alt Registration Flow
        DB-->>Auth: Email not found
        Note over Auth: Hash password with bcryptjs (12 salt rounds)
        Auth->>DB: Save User Document
    else Login Flow
        DB-->>Auth: User Found
        Note over Auth: Verify password using user.comparePassword()
    end
    Auth-->>FE: 200/201: Return JWT Token (7d expiry) + User Info
    FE->>FE: Store token in localStorage ('hp_token', 'hp_user')
    FE-->>Patient: Redirect to previous route or Home
```

---

### 2. Doctor Appointment & Queue Tracker Flow

Enables patients to browse hospitals, choose specialists, and book appointment slots with database-level conflict prevention and live queue tracking.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient
    participant FE as React Client (Doctors.jsx / QueueTracker.jsx)
    participant Server as Express Server (/api/appointments)
    participant DB as MongoDB (Appointment Model)

    Patient->>FE: Select Hospital -> Speciality -> Doctor
    Patient->>FE: Pick Date & Slot -> Click 'Confirm Booking'
    FE->>Server: POST /api/appointments (Bearer JWT + doctorId, date, slot)
    Note over Server: authMiddleware verifies JWT<br/>express-validator validates fields
    Server->>DB: Attempt to insert appointment (status: Confirmed)
    alt Slot is Available
        DB-->>Server: Appointment saved successfully (bookingId: BK-XXXX)
        Server-->>FE: 201 Created (Appointment Record)
        FE-->>Patient: Navigate to /queue/:bookingId
        Note over FE: QueueTracker displays current token, queue position & ETA countdown
    else Slot Already Occupied
        DB-->>Server: Duplicate key error (code 11000 on doctorId + date + slot)
        Server-->>FE: 409 Conflict: "Doctor already has an appointment booked for this slot."
        FE-->>Patient: Prompt user to pick another time slot
    end
```

---

### 3. Diagnostic Lab Booking Flow

Enables patients to select lab tests, choose walk-in or home sample pickup, and prevents client-side price tampering by recalculating test amounts on the server.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient
    participant FE as React Client (LabDetails.jsx)
    participant Server as Express Server (/api/test-bookings)
    participant DB as MongoDB (LabTest & TestBooking Models)

    Patient->>FE: Browse Labs -> Select Diagnostic Tests (cart)
    Patient->>FE: Choose Visit Type (home / center) & Submit
    FE->>Server: POST /api/test-bookings (Bearer JWT, labId, tests array, visitType)
    Note over Server: authMiddleware verifies JWT
    Server->>DB: Query LabTest collection by originalId for all test IDs in array
    DB-->>Server: Returns canonical test records
    Note over Server: Server computes totalAmount = sum of test.price<br/>Generates unique bookingId: LAB-XXXX
    Server->>DB: Insert TestBooking document
    DB-->>Server: Document saved
    Server-->>FE: 201 Created (Booking Details with server totalAmount)
    FE-->>Patient: Redirect to /labs/reports (Reports Dashboard)
```

---

### 4. Pharmacy Prescription & Medicine Order Flow

Supports prescription file uploads, home delivery details, and order tracking across partner pharmacies.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient
    participant FE as React Client (PharmacyDetails.jsx)
    participant Server as Express Server (/api/medicine-orders)
    participant DB as MongoDB (MedicineOrder Model)

    Patient->>FE: Select Pharmacy -> Attach Prescription File / Notes
    Patient->>FE: Enter Delivery Address -> Submit Order
    FE->>Server: POST /api/medicine-orders (Bearer JWT + order payload)
    Note over Server: authMiddleware validates token<br/>express-validator verifies pharmacyId and address
    Note over Server: Generate unique orderId: ORD-XXXX (crypto.randomUUID)
    Server->>DB: Save MedicineOrder (status: "Pending Review")
    DB-->>Server: Order stored
    Server-->>FE: 201 Created (Order Receipt)
    FE-->>Patient: Show Order Confirmation with orderId and status
```

---

### 5. AI Health Assistant Consultation Flow

Provides contextual triage guidance powered by Google Gemini 2.0 Flash, dynamically loaded directory data from MongoDB, and an offline fallback engine.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient
    participant Chat as HealthPath AI Widget (ChatBot.jsx)
    participant Server as Express Server (/api/chat)
    participant Cache as In-Memory Context Cache (5-min TTL)
    participant DB as MongoDB (Hospital & Doctor Models)
    participant Gemini as Google Gemini AI API

    Patient->>Chat: Type symptom description (e.g., "Sharp knee pain")
    Chat->>Server: POST /api/chat (messages array)
    Note over Server: Rate limiting check (10 req / min per IP)<br/>Payload validation
    alt In-Memory Prompt Cache Expired (> 5 min)
        Server->>DB: Fetch all Hospitals and Doctors
        DB-->>Server: Active provider records
        Server->>Cache: Assemble & cache dynamic system prompt with active directory
    else Cache Valid (< 5 min)
        Server->>Cache: Reuse cached directory prompt
    end
    alt Gemini API Key Available
        Server->>Gemini: generateContent(cachedSystemPrompt + messages)
        alt Gemini Responds
            Gemini-->>Server: Triage guidance + specialist suggestions
            Server-->>Chat: 200 OK { reply, source: "gemini" }
        else Gemini Timeout / Error
            Note over Server: Execute internal keyword fallback engine
            Server-->>Chat: 200 OK { reply: fallbackText, source: "fallback" }
        end
    else No Gemini API Key
        Note over Server: Execute internal keyword fallback engine
        Server-->>Chat: 200 OK { reply: fallbackText, source: "fallback" }
    end
    Chat-->>Patient: Render response with medical triage disclaimer
```

---

### 6. Organ & Tissue Donation Pledge Flow

Enables donors to submit digital pledge commitments to accredited organ procurement organizations and receive a verifiable registration ID.

```mermaid
sequenceDiagram
    autonumber
    actor Donor as Donor / Patient
    participant FE as React Client (Donation.jsx)
    participant Server as Express Server (/api/organ-pledges)
    participant DB as MongoDB (OrganPledge Model)

    Donor->>FE: Select Accredited Organization (e.g. NOTTO, Mohan Foundation)
    Donor->>FE: Fill Donor Form (Name, Email, Phone, Blood Group, Pledge Type)
    FE->>Server: POST /api/organ-pledges (Bearer JWT + pledge data)
    Note over Server: authMiddleware verifies JWT<br/>express-validator checks all required fields
    Note over Server: Generate unique pledgeId: DON-XXXX
    Server->>DB: Save OrganPledge record
    DB-->>Server: Pledge document saved
    Server-->>FE: 201 Created (Pledge Confirmation with pledgeId)
    FE-->>Donor: Display Digital Donor Card with certificate ID
```
