const mongoose = require('mongoose');

const medicineOrderSchema = new mongoose.Schema({
  orderId: String,
  userId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pharmacyId: String,
  deliveryAddress: String,
  notes: String,
  prescriptionFile: String, // Path or URL
  status: { type: String, default: 'Pending Review' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicineOrder', medicineOrderSchema);
