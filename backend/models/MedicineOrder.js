const mongoose = require('mongoose');

const medicineOrderSchema = new mongoose.Schema({
  orderId: String,
  pharmacyId: String,
  deliveryAddress: String,
  notes: String,
  prescriptionFile: String, // Path or URL
  status: { type: String, default: 'Pending Review' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicineOrder', medicineOrderSchema);
