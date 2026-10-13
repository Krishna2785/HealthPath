# Security & Validation

HealthPath implements defense-in-depth principles across authentication, request validation, business logic integrity, database concurrency, and rate limiting.

---

## 1. Password Hashing & Encryption (`bcryptjs`)

- **Pre-Save Mongoose Hook**: In `backend/models/User.js`, password hashing occurs asynchronously before persistence:
  ```javascript
  userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
  });
  ```
- **High Work Factor**: Configured with **12 salt rounds**, defending against rainbow table attacks and brute-force cracking attempts.
- **Constant-Time Comparison**: Handled via `user.comparePassword(candidatePassword)` using `bcrypt.compare` to mitigate timing attacks.

---

## 2. Stateless Session Security & JWT Verification

- **Token Signing**: Generated upon successful registration or login using `jsonwebtoken`:
  ```javascript
  jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  ```
- **Startup Secret Guard**: Both `backend/server.js` and `backend/middleware/auth.js` enforce a strict environment check on boot:
  ```javascript
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set. Exiting.');
    process.exit(1);
  }
  ```
  If `JWT_SECRET` is missing, the server terminates immediately rather than running insecurely with a fallback secret.
- **Route Authorization**: Protected endpoints require the `Authorization: Bearer <token>` header, verified by `authMiddleware` before reaching business controllers.

---

## 3. Strict Input Validation (`express-validator`)

To prevent malformed payloads, injection, or incomplete data structures, endpoints validate inputs at the HTTP boundary:

- **Authentication**:
  - `name`: `.trim().notEmpty().withMessage('Name is required')`
  - `email`: `.isEmail().withMessage('Please provide a valid email')`
  - `password`: `.isLength({ min: 6 }).withMessage('Password must be at least 6 characters')`
- **Appointments**: Mandatory `doctorId`, `date`, and `slot`.
- **Diagnostic Bookings**: Verifies `labId`, `visitType`, and ensures `tests` is a non-empty array (`.isArray({ min: 1 })`).
- **Medicine Orders**: Enforces presence of `pharmacyId` and `deliveryAddress`.
- **Organ Pledges**: Strict checks across `orgId`, `name`, `email`, `phone`, `bloodGroup`, and `pledgeType`.

Errors return a clean, unified `400 Bad Request` format with descriptive messaging.

---

## 4. Server-Side Price Recalculation (Anti-Tampering)

When submitting lab bookings via `POST /api/test-bookings`, client payloads specify requested test IDs (`tests: [...]`), but the server **does not trust** client-side price totals:

```javascript
// Query authoritative prices directly from the LabTest database
const labTestDocs = await LabTest.find({ originalId: { $in: tests } });
const totalAmount = labTestDocs.reduce((sum, t) => sum + (t.price || 0), 0);
```

This prevents malicious clients from intercepting requests and setting artificially low or zero-dollar order amounts.

---

## 5. Race Condition & Slot Collision Prevention

In high-concurrency environments, two users attempting to book the same doctor slot simultaneously could lead to double-booking. HealthPath prevents this at the database engine level using a **partial unique compound index** in `backend/models/Appointment.js`:

```javascript
appointmentSchema.index(
  { doctorId: 1, date: 1, slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['Confirmed', 'Pending'] } }
  }
);
```

- When a collision occurs, MongoDB returns error code `11000`.
- The Express controller intercepts this code and issues a clean `409 Conflict`:
  ```javascript
  if (error.code === 11000) {
    return res.status(409).json({
      error: 'Doctor already has an appointment booked for this date and time slot.'
    });
  }
  ```
- Because the index uses a partial filter expression, cancelled appointments (`status: 'Cancelled'`) are excluded, allowing the slot to be booked again without constraint violations.

---

## 6. Denial-of-Service & Abuse Protection (`express-rate-limit`)

Rate limiters protect vulnerable routes against automated scraping and credential stuffing:

1. **Authentication Endpoints** (`/api/auth/register`, `/api/auth/login`):
   - **Limit**: 10 requests per 15 minutes per IP address.
   - **Exceeded Response**: HTTP `429 Too Many Requests` (`"Too many requests. Please wait 15 minutes and try again."`).
2. **AI Chatbot Endpoint** (`/api/chat`):
   - **Limit**: 10 requests per minute per IP address.
   - **Exceeded Response**: HTTP `429 Too Many Requests` (`"Too many chat requests. Please wait a moment and try again."`).
