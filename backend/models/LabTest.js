const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  originalId: String,
  name: String,
  category: String,
  price: Number,
  turnaround: String,
  description: String
});

module.exports = mongoose.model('LabTest', labTestSchema);
