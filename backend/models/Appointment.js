const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  bookingId: String,
  userId: String,
  doctorId: String,
  doctorName: String,
  speciality: String,
  hospitalName: String,
  patientName: String,
  date: { type: String, required: true }, // YYYY-MM-DD
  slot: { type: String, required: true }, // e.g. "10:00 AM"
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

// Unique compound index on (doctorId, date, slot) for non-cancelled appointments.
// This allows the same time slot to be booked on different dates, while preventing
// double-booking the same doctor at the same time on the same date.
appointmentSchema.index({ doctorId: 1, date: 1, slot: 1 }, {
  unique: true,
  partialFilterExpression: { status: { $in: ['Confirmed', 'Pending'] } }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
