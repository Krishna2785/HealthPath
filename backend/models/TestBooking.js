const mongoose = require('mongoose');

const testBookingSchema = new mongoose.Schema({
  bookingId: String,
  userId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  labId: String,
  tests: [String], // Array of LabTest originalIds
  visitType: String,
  totalAmount: Number, // server-calculated from LabTest prices
  status: { type: String, default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestBooking', testBookingSchema);
