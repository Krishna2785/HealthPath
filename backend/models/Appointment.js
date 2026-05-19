const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  bookingId: String,
  userId: String,
  doctorId: String,
  doctorName: String,
  speciality: String,
  hospitalName: String,
  patientName: String,
  slot: String,
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
