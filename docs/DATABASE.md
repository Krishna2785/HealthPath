# Database Models & Schemas

HealthPath uses MongoDB with Mongoose 9 ODM for schema definition, validation, and database operations.

---

## Collections & Schemas

| Model | Collection | Primary Schema Fields & Types | Description |
| :--- | :--- | :--- | :--- |
| **`User`** | `users` | `name` (String, req), `email` (String, req, unique, lowercase), `password` (String, req, bcrypt hashed), `createdAt` (Date) | User accounts and authentication credentials. |
| **`Hospital`** | `hospitals` | `originalId` (String), `name` (String), `rating` (Number), `type` (String), `status` (String), `distance` (Number), `distanceStr` (String), `image` (String), `specialities` ([String]), `timings` (String) | Partner hospital facilities, departments, and operating hours. |
| **`Doctor`** | `doctors` | `originalId` (String), `name` (String), `hospitalId` (String), `speciality` (String), `rating` (Number), `reviewsCount` (Number), `experience` (String), `fee` (Number), `image` (String), `about` (String), `availability` ([String]), `timeSlots` ([String]), `reviews` ([Object]) | Medical specialist directory and consultation metadata. |
| **`Appointment`** | `appointments` | `bookingId` (String), `userId` (String), `doctorId` (String), `doctorName` (String), `speciality` (String), `hospitalName` (String), `patientName` (String), `date` (String, req), `slot` (String, req), `status` (String, default: "Confirmed"), `createdAt` (Date) | Booked doctor appointments and OPD queue entries. |
| **`Lab`** | `labs` | `originalId` (String), `name` (String), `rating` (Number), `reviewsCount` (Number), `distance` (Number), `distanceStr` (String), `address` (String), `image` (String), `testsOffered` ([String]), `homeCollection` (Boolean), `reportTime` (String) | Diagnostic pathology centers and collection providers. |
| **`LabTest`** | `labtests` | `originalId` (String), `name` (String), `category` (String), `price` (Number), `turnaround` (String), `fasting` (String), `description` (String) | Catalog of medical tests, preparation instructions, and pricing. |
| **`TestBooking`** | `testbookings` | `bookingId` (String), `userId` (String, req), `user` (ObjectId, ref: 'User'), `labId` (String), `tests` ([String]), `visitType` (String), `totalAmount` (Number), `status` (String, default: "Scheduled"), `createdAt` (Date) | Diagnostic test bookings scheduled at center or via home collection. |
| **`Pharmacy`** | `pharmacies` | `originalId` (String), `name` (String), `rating` (Number), `reviewsCount` (Number), `distance` (Number), `distanceStr` (String), `address` (String), `image` (String), `deliveryTime` (String), `openStatus` (String), `offers` ([String]) | Licensed pharmacy retail partners. |
| **`MedicineOrder`** | `medicineorders` | `orderId` (String), `userId` (String, req), `user` (ObjectId, ref: 'User'), `pharmacyId` (String), `deliveryAddress` (String), `notes` (String), `prescriptionFile` (String), `status` (String, default: "Pending Review"), `createdAt` (Date) | Medicine prescription fulfillments and delivery orders. |
| **`DonationOrg`** | `donationorgs` | `originalId` (String), `name` (String), `type` (String), `causes` ([String]), `registrationNo` (String), `rating` (Number), `image` (String) | Accredited organ and tissue procurement organizations. |
| **`OrganPledge`** | `organpledges` | `pledgeId` (String), `orgId` (String), `name` (String), `email` (String), `phone` (String), `bloodGroup` (String), `pledgeType` (String), `createdAt` (Date) | Donor commitments and registrations. |

---

## Indexes & Integrity Rules

### 1. Partial Unique Compound Index (Slot Collision Guard)
To prevent simultaneous double-booking of a doctor for the exact same date and time slot, `Appointment.js` enforces a partial unique compound index:

```javascript
appointmentSchema.index(
  { doctorId: 1, date: 1, slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['Confirmed', 'Pending'] } }
  }
);
```

**Key Behaviors:**
- **Double-booking Prevention**: Two patients cannot book the same `doctorId`, `date`, and `slot` while status is `Confirmed` or `Pending`. MongoDB immediately rejects collisions with error code `11000`, returned to the client as an HTTP `409 Conflict`.
- **Cancellation Slot Release**: Because the index applies only when `status` is `'Confirmed'` or `'Pending'`, marking an appointment as `Cancelled` (`PATCH /api/appointments/:id/cancel`) instantly releases the slot for another patient without index constraint conflicts.

### 2. User Account Unique Index
- `User.email` is defined with `{ unique: true, lowercase: true }`, preventing duplicate account registration and enforcing normalized case comparisons.

---

## Entity Relationships

- **User Relationships**:
  - `TestBooking.user` and `MedicineOrder.user` maintain an `ObjectId` reference (`ref: 'User'`) alongside `userId` string matching `req.user.id` for versatile lookup.
  - `Appointment.userId` stores the authenticated user's ID for appointment history aggregation.
- **Provider Relationships**:
  - `Doctor.hospitalId` maps directly to `Hospital.originalId`, associating specialists with their primary clinic or hospital facility.
  - `TestBooking.labId` maps to `Lab.originalId`.
  - `TestBooking.tests` stores an array of `LabTest.originalId` strings; during booking creation, the backend re-queries `LabTest.find({ originalId: { $in: tests } })` to verify test existence and recalculate the exact order amount.
  - `MedicineOrder.pharmacyId` maps to `Pharmacy.originalId`.
  - `OrganPledge.orgId` maps to `DonationOrg.originalId`.
