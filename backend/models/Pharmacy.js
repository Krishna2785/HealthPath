const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  originalId: String,
  name: String,
  rating: Number,
  status: String,
  distance: Number,
  distanceStr: String,
  image: String,
  address: String,
  deliveryTime: String,
  freeDeliveryAbove: Number
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);
