# API Reference

Base URL for all backend endpoints in local development: `http://localhost:5000`

---

## Table of Contents
- [Authentication](#authentication)
- [Public Directory](#public-directory)
- [Protected Appointments & Orders](#protected-appointments--orders)
- [AI Chatbot](#ai-chatbot)

---

## Authentication

### 1. Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Auth**: None
- **Rate Limit**: 10 requests / 15 minutes per IP
- **Validation**:
  - `name`: non-empty string
  - `email`: valid email format
  - `password`: minimum 6 characters

#### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

#### Response (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f1a9b8e4e9b001a123456",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### 2. Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth**: None
- **Rate Limit**: 10 requests / 15 minutes per IP
- **Validation**:
  - `email`: valid email format
  - `password`: non-empty string

#### Request Body
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

#### Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f1a9b8e4e9b001a123456",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### 3. Get Current User Profile
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Rate Limit**: None

#### Response (200 OK)
```json
{
  "user": {
    "id": "673f1a9b8e4e9b001a123456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "iat": 1718000000,
    "exp": 1718604800
  }
}
```

---

## Public Directory

All public directory endpoints return catalog data and do not require authentication or strict rate limiting.

### 1. List Hospitals
- **Method**: `GET`
- **Path**: `/api/hospitals`
- **Auth**: None

#### Response (200 OK)
```json
[
  {
    "_id": "673f1b...",
    "originalId": "h1",
    "name": "Dr. D. Y. Patil Hospital & Research Centre",
    "rating": 4.6,
    "type": "Hospital",
    "status": "Open",
    "distance": 0.5,
    "distanceStr": "~0.5 km",
    "specialities": ["General Medicine", "Cardiology", "Orthopedics"],
    "timings": "Mon–Sat: 9:00 AM – 4:00 PM | Emergency: 24×7"
  }
]
```

---

### 2. List Doctors
- **Method**: `GET`
- **Path**: `/api/doctors`
- **Query Parameters**:
  - `hospitalId` (optional, string): Filter by hospital `originalId`
  - `speciality` (optional, string): Filter by doctor speciality
- **Auth**: None

#### Response (200 OK)
```json
[
  {
    "_id": "673f1c...",
    "originalId": "d1",
    "name": "Dr. Priya Sharma",
    "hospitalId": "h1",
    "speciality": "Cardiology",
    "rating": 4.8,
    "reviewsCount": 42,
    "experience": "12 Years",
    "fee": 800,
    "availability": ["Mon", "Tue", "Thu"],
    "timeSlots": ["10:00 AM", "11:30 AM", "02:00 PM"]
  }
]
```

---

### 3. List Labs
- **Method**: `GET`
- **Path**: `/api/labs`
- **Auth**: None

#### Response (200 OK)
```json
[
  {
    "_id": "673f1d...",
    "originalId": "l1",
    "name": "Dr. Lal PathLabs",
    "rating": 4.7,
    "distance": 1.2,
    "distanceStr": "~1.2 km",
    "homeCollection": true,
    "reportTime": "24–48 Hours",
    "testsOffered": ["CBC", "Lipid Profile", "Thyroid Profile"]
  }
]
```

---

### 4. List Diagnostic Lab Tests
- **Method**: `GET`
- **Path**: `/api/lab-tests`
- **Auth**: None

#### Response (200 OK)
```json
[
  {
    "_id": "673f1e...",
    "originalId": "t1",
    "name": "Complete Blood Count (CBC)",
    "category": "Hematology",
    "price": 350,
    "turnaround": "24 Hours",
    "fasting": "No fasting required",
    "description": "Evaluates overall health and detects a variety of disorders."
  }
]
```

---

### 5. List Pharmacies
- **Method**: `GET`
- **Path**: `/api/pharmacies`
- **Auth**: None

#### Response (200 OK)
```json
[
  {
    "_id": "673f1f...",
    "originalId": "p1",
    "name": "Apollo Pharmacy",
    "rating": 4.5,
    "distance": 0.4,
    "distanceStr": "~0.4 km",
    "deliveryTime": "30-45 mins",
    "openStatus": "Open 24/7"
  }
]
```

---

### 6. List Organ Donation Organizations
- **Method**: `GET`
- **Path**: `/api/donation-orgs`
- **Auth**: None

#### Response (200 OK)
```json
[
  {
    "_id": "673f2a...",
    "originalId": "org1",
    "name": "NOTTO (National Organ & Tissue Transplant Org)",
    "type": "National Apex Body",
    "causes": ["Deceased Organ Donation", "Tissue Registry"],
    "registrationNo": "GOI/MOHFW/NOTTO/2014",
    "rating": 4.9
  }
]
```

---

## Protected Appointments & Orders

All endpoints below require header: `Authorization: Bearer <token>`.

### 1. List My Appointments
- **Method**: `GET`
- **Path**: `/api/appointments` (also aliased as `/api/appointments/my`)
- **Auth**: Required

#### Response (200 OK)
```json
[
  {
    "_id": "673f3a...",
    "bookingId": "BK-9B4E12",
    "userId": "673f1a9b8e4e9b001a123456",
    "doctorId": "d1",
    "doctorName": "Dr. Priya Sharma",
    "speciality": "Cardiology",
    "hospitalName": "Dr. D. Y. Patil Hospital",
    "patientName": "Jane Doe",
    "date": "2026-10-15",
    "slot": "10:00 AM",
    "status": "Confirmed",
    "createdAt": "2026-10-13T10:00:00.000Z"
  }
]
```

---

### 2. Book an Appointment
- **Method**: `POST`
- **Path**: `/api/appointments`
- **Auth**: Required
- **Validation**:
  - `doctorId`: required
  - `date`: required (YYYY-MM-DD)
  - `slot`: required (e.g., "10:00 AM")

#### Request Body
```json
{
  "doctorId": "d1",
  "date": "2026-10-15",
  "slot": "10:00 AM",
  "doctorName": "Dr. Priya Sharma",
  "speciality": "Cardiology",
  "hospitalName": "Dr. D. Y. Patil Hospital"
}
```

#### Response (201 Created)
```json
{
  "_id": "673f3a...",
  "bookingId": "BK-9B4E12",
  "userId": "673f1a9b8e4e9b001a123456",
  "doctorId": "d1",
  "doctorName": "Dr. Priya Sharma",
  "speciality": "Cardiology",
  "hospitalName": "Dr. D. Y. Patil Hospital",
  "patientName": "Jane Doe",
  "date": "2026-10-15",
  "slot": "10:00 AM",
  "status": "Confirmed",
  "createdAt": "2026-10-13T10:00:00.000Z"
}
```

#### Response (409 Conflict)
```json
{
  "error": "Doctor already has an appointment booked for this date and time slot."
}
```

---

### 3. Cancel Appointment
- **Method**: `PATCH`
- **Path**: `/api/appointments/:id/cancel`
- **Auth**: Required
- **Note**: `:id` can be MongoDB `_id` or `bookingId` (`BK-XXXXXX`).

#### Response (200 OK)
```json
{
  "message": "Appointment cancelled successfully",
  "appointment": {
    "_id": "673f3a...",
    "bookingId": "BK-9B4E12",
    "status": "Cancelled"
  }
}
```

---

### 4. List My Diagnostic Lab Bookings
- **Method**: `GET`
- **Path**: `/api/test-bookings` (or `/api/test-bookings/my`)
- **Auth**: Required

#### Response (200 OK)
```json
[
  {
    "_id": "673f4a...",
    "bookingId": "LAB-4F2A10",
    "userId": "673f1a9b8e4e9b001a123456",
    "labId": "l1",
    "tests": ["t1", "t2"],
    "visitType": "home",
    "totalAmount": 950,
    "status": "Scheduled",
    "createdAt": "2026-10-13T10:15:00.000Z"
  }
]
```

---

### 5. Schedule Lab Tests
- **Method**: `POST`
- **Path**: `/api/test-bookings`
- **Auth**: Required
- **Validation**:
  - `labId`: required
  - `tests`: non-empty array of test `originalId` strings
  - `visitType`: required (`"home"` or `"center"`)
- **Security**: The backend recalculates `totalAmount` by summing the prices of tests queried directly from the `LabTest` collection.

#### Request Body
```json
{
  "labId": "l1",
  "tests": ["t1", "t2"],
  "visitType": "home"
}
```

#### Response (201 Created)
```json
{
  "_id": "673f4a...",
  "bookingId": "LAB-4F2A10",
  "userId": "673f1a9b8e4e9b001a123456",
  "labId": "l1",
  "tests": ["t1", "t2"],
  "visitType": "home",
  "totalAmount": 950,
  "status": "Scheduled",
  "createdAt": "2026-10-13T10:15:00.000Z"
}
```

---

### 6. List My Pharmacy Orders
- **Method**: `GET`
- **Path**: `/api/medicine-orders` (or `/api/medicine-orders/my`)
- **Auth**: Required

#### Response (200 OK)
```json
[
  {
    "_id": "673f5a...",
    "orderId": "ORD-11A9D0",
    "userId": "673f1a9b8e4e9b001a123456",
    "pharmacyId": "p1",
    "deliveryAddress": "Flat 402, Greenfield Apts, Sector 12",
    "notes": "Deliver after 5 PM",
    "status": "Pending Review",
    "createdAt": "2026-10-13T11:00:00.000Z"
  }
]
```

---

### 7. Place Pharmacy Order
- **Method**: `POST`
- **Path**: `/api/medicine-orders`
- **Auth**: Required
- **Validation**:
  - `pharmacyId`: required
  - `deliveryAddress`: required

#### Request Body
```json
{
  "pharmacyId": "p1",
  "deliveryAddress": "Flat 402, Greenfield Apts, Sector 12",
  "notes": "Deliver after 5 PM",
  "prescriptionFile": "data:image/jpeg;base64,..."
}
```

#### Response (201 Created)
```json
{
  "_id": "673f5a...",
  "orderId": "ORD-11A9D0",
  "userId": "673f1a9b8e4e9b001a123456",
  "pharmacyId": "p1",
  "deliveryAddress": "Flat 402, Greenfield Apts, Sector 12",
  "notes": "Deliver after 5 PM",
  "prescriptionFile": "data:image/jpeg;base64,...",
  "status": "Pending Review",
  "createdAt": "2026-10-13T11:00:00.000Z"
}
```

---

### 8. Register Organ Donation Pledge
- **Method**: `POST`
- **Path**: `/api/organ-pledges`
- **Auth**: Required
- **Validation**:
  - `orgId`: required
  - `name`: required
  - `email`: valid email
  - `phone`: required
  - `bloodGroup`: required
  - `pledgeType`: required

#### Request Body
```json
{
  "orgId": "org1",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "bloodGroup": "O+",
  "pledgeType": "All Organs & Tissues"
}
```

#### Response (201 Created)
```json
{
  "_id": "673f6a...",
  "pledgeId": "DON-78E3F2",
  "orgId": "org1",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "bloodGroup": "O+",
  "pledgeType": "All Organs & Tissues",
  "createdAt": "2026-10-13T11:30:00.000Z"
}
```

---

## AI Chatbot

Chat endpoints are defined in `backend/routes/chat.js` and mounted at `/api/chat`.

### 1. Send Message to Health Assistant
- **Method**: `POST`
- **Path**: `/api/chat`
- **Auth**: None (app client)
- **Rate Limit**: 10 requests / 1 minute per IP
- **Validation**:
  - `messages`: non-empty array of objects each containing `role` (`"user"` or `"model"`) and `text` (string)

#### Request Body
```json
{
  "messages": [
    {
      "role": "user",
      "text": "I have severe knee pain after playing sports. Which doctor should I visit?"
    }
  ]
}
```

#### Response (200 OK - Gemini or Fallback)
```json
{
  "reply": "I am sorry to hear you are experiencing knee pain. For knee or joint concerns, I recommend consulting an Orthopedic specialist. On HealthPath, you can visit Dr. Rakesh Verma (Orthopedics) at Dr. D. Y. Patil Hospital. Please note that this is not a medical diagnosis; if you experience severe swelling or inability to bear weight, seek emergency care immediately.",
  "source": "gemini"
}
```

#### Response (429 Too Many Requests)
```json
{
  "error": "Too many chat requests. Please wait a moment and try again."
}
```

---

### 2. Check Gemini Integration Health
- **Method**: `GET`
- **Path**: `/api/chat/health`
- **Auth**: None
- **Rate Limit**: None

#### Response (200 OK - Active)
```json
{
  "gemini": "ok"
}
```

#### Response (200 OK - Failing or Unconfigured)
```json
{
  "gemini": "failing",
  "reason": "GEMINI_API_KEY is not set"
}
```
