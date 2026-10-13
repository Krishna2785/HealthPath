# HealthPath

An intelligent, full-stack healthcare discovery and digital patient journey platform connecting patients with hospitals, specialists, diagnostic labs, pharmacies, and organ donation organizations.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## Overview

HealthPath unifies fragmented digital healthcare services into a single modern web application. Patients can discover nearby hospitals and specialists, book appointments with real-time slot conflict prevention, track OPD queue times, schedule diagnostic lab tests, upload prescriptions to local pharmacies, and pledge organ donations. The platform also embeds an AI-powered triage assistant that offers contextual healthcare recommendations using live provider directory data.

## Key Features

- **Hospital & Specialist Booking**: Discover hospitals, filter doctors by speciality, and book slots with duplicate prevention.
- **Live OPD Queue Tracker**: Monitor appointment progress and estimated waiting times with a live queue simulator.
- **Diagnostic Lab Tests**: Browse diagnostic packages, order home sample pickups or center visits, and view bookings.
- **Pharmacy Prescription Orders**: Locate verified pharmacies, upload prescription slips, and request home delivery.
- **AI Health Assistant**: Get instant symptom triage recommendations via Google Gemini 2.0 Flash with an offline fallback.
- **Organ Donation Pledges**: Complete accredited donor pledge registrations and receive digital certification IDs.
- **Secure Authentication**: Protected routes backed by JWT tokens, bcrypt password hashing, and endpoint rate limiting.

## Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v7, Lucide React
- **Backend**: Node.js, Express 5, Mongoose 9, JWT, bcryptjs, express-validator, express-rate-limit
- **AI & Integrations**: Google Gemini 2.0 Flash (`@google/generative-ai`), in-memory directory cache, rule fallback engine

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- [Google Gemini API Key](https://aistudio.google.com/) *(optional, for AI assistant)*

### Environment Variables

Configure backend variables in `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/health
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Configure frontend variables in root `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
git clone https://github.com/Krishna2785/HealthPath.git
cd HealthPath
npm install
cd backend && npm install && cd ..
```

### Seed the Database

Populate MongoDB with hospitals, doctors, diagnostic tests, pharmacies, and donation organizations:

```bash
cd backend
npm run seed
cd ..
```

### Run the App

Start the backend and frontend in separate terminals:

**Terminal 1 (Backend API):**
```bash
npm run server
```
*Backend runs at:* `http://localhost:5000`

**Terminal 2 (Frontend Client):**
```bash
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

## Documentation

Comprehensive architecture, workflow, and API documentation is available in the [`docs/`](docs/) directory:

- [System Architecture](docs/ARCHITECTURE.md) - System architecture diagram, component roles, and layer breakdown.
- [Application Workflows](docs/WORKFLOWS.md) - End-to-end sequence diagrams for all six user journeys.
- [Database Models & Schemas](docs/DATABASE.md) - Data models, field types, relationships, and index definitions.
- [API Reference](docs/API.md) - REST API endpoints, parameters, authentication requirements, and payloads.
- [Security & Validation](docs/SECURITY.md) - Password hashing, input validation, rate limiting, and integrity controls.
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Repository directory map and component responsibilities.

## Contributing

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to your branch (`git push origin feature/NewFeature`).
5. Open a Pull Request for review.


