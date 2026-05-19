const mongoose = require('mongoose');

const testBookingSchema = new mongoose.Schema({
  bookingId: String,
  labId: String,
  tests: [String], // Array of LabTest originalIds
  visitType: String,
  totalAmount: Number,
  status: { type: String, default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestBooking', testBookingSchema);
