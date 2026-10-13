# Project Structure

This document outlines the directory structure of the HealthPath repository and explains the responsibility of each folder and file.

> **Routing Architecture Note**:
> Most REST API endpoints (authentication, hospitals, doctors, appointments, test bookings, medicine orders, and organ pledges) are declared directly in [`backend/server.js`](../backend/server.js). The conversational AI assistant route is encapsulated separately in [`backend/routes/chat.js`](../backend/routes/chat.js) and mounted at `/api/chat`.

---

## Directory Tree

```text
healthpath/
├── .env.example                 # Template for frontend environment variables (VITE_API_BASE_URL)
├── .gitignore                   # Git exclusion rules for node_modules, dist, and local .env files
├── package.json                 # Frontend dependencies (React 19, Tailwind v4, Vite 8) and scripts
├── package-lock.json            # Exact frontend dependency tree locks
├── vite.config.js               # Vite bundler configuration including @tailwindcss/vite plugin
├── eslint.config.js             # Flat ESLint configuration rules for React & JS
├── index.html                   # Single-Page Application root HTML entry point
├── README.md                    # Primary repository overview, setup guide, and documentation index
│
├── docs/                        # Architectural specifications and technical documentation
│   ├── ARCHITECTURE.md          # System architecture diagram and layer explanations
│   ├── WORKFLOWS.md             # Sequence diagrams for the 6 core user and data journeys
│   ├── DATABASE.md              # Database models, schemas, and indexing strategies
│   ├── API.md                   # REST API reference with sample payloads and status codes
│   ├── SECURITY.md              # Security policies, password hashing, and anti-tampering guards
│   └── PROJECT_STRUCTURE.md     # Repository directory layout and architectural notes
│
├── backend/                     # Node.js + Express backend service
│   ├── .env.example             # Backend environment template (MONGODB_URI, JWT_SECRET, GEMINI_API_KEY)
│   ├── package.json             # Backend dependencies (Express 5, Mongoose 9, JWT, bcryptjs)
│   ├── server.js                # Main Express server, database connection, and primary REST endpoints
│   ├── seed.js                  # Database seeder script loading initial hospitals, doctors, and tests
│   │
│   ├── middleware/
│   │   └── auth.js              # Bearer JWT verification middleware protecting user endpoints
│   │
│   ├── models/                  # Mongoose data schema definitions
│   │   ├── Appointment.js       # Doctor appointments with partial unique slot index
│   │   ├── Doctor.js            # Doctor profiles, fees, availability, and ratings
│   │   ├── DonationOrg.js       # Registered organ procurement organizations
│   │   ├── Hospital.js          # Hospital directory data, timings, and specialities
│   │   ├── Lab.js               # Pathology and diagnostic laboratory centers
│   │   ├── LabTest.js           # Lab tests, descriptions, preparation, and pricing
│   │   ├── MedicineOrder.js     # Pharmacy orders and prescription upload records
│   │   ├── OrganPledge.js       # Donor organ and tissue pledge certificates
│   │   ├── Pharmacy.js          # Partner pharmacies, locations, and delivery times
│   │   ├── TestBooking.js       # Diagnostic test booking submissions
│   │   └── User.js              # User profiles with pre-save bcrypt hashing hook
│   │
│   └── routes/
│       └── chat.js              # HealthPath AI chat endpoint with Gemini API and offline fallback
│
├── public/                      # Static client assets served directly by Vite
│   ├── favicon.svg              # HealthPath browser tab icon
│   └── icons.svg                # Scalable vector graphics sprite definitions
│
└── src/                         # Frontend React 19 source code
    ├── App.jsx                  # Main router setup, route definitions, and ProtectedRoute wrapper
    ├── api.js                   # Configured base URL for backend API calls
    ├── index.css                # Global stylesheet and Tailwind CSS v4 import directives
    ├── main.jsx                 # React DOM entry point mounting root App
    │
    ├── assets/                  # Frontend images and brand assets
    │
    ├── components/              # Shared reusable React UI components
    │   ├── AppointmentsSidebar.jsx # Slide-over drawer for viewing and canceling appointments
    │   └── ChatBot.jsx          # Interactive floating AI assistant widget
    │
    ├── context/
    │   └── AuthContext.jsx      # Authentication state provider managing tokens and authFetch
    │
    ├── data/
    │   └── mockData.js          # Initial mock data source used by seed.js and offline fallbacks
    │
    └── pages/                   # Route-level React views
        ├── Home.jsx             # Hero landing page, location picker, and healthcare service cards
        ├── Login.jsx            # Tabbed Sign In and Register forms
        ├── Hospitals.jsx        # Hospital discovery and filtering by department
        ├── HospitalDetails.jsx  # Department overview and specialist selection
        ├── Doctors.jsx          # Doctor consultation profiles and slot scheduling
        ├── QueueTracker.jsx     # OPD queue tracker simulating wait times and queue progress
        ├── Labs.jsx             # Diagnostic pathology lab directory
        ├── LabDetails.jsx       # Diagnostic test selection and multi-test cart
        ├── ReportsDashboard.jsx # Patient test booking records and sample pickup status
        ├── Pharmacies.jsx       # Pharmacy locator with delivery estimates
        ├── PharmacyDetails.jsx  # Prescription upload and address checkout
        └── Donation.jsx         # Multi-step organ and tissue donation pledge flow
```
