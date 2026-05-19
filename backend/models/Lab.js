const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  originalId: String,
  name: String,
  rating: Number,
  status: String,
  distance: Number,
  distanceStr: String,
  image: String,
  address: String,
  timings: String,
  homeCollection: Boolean
});

module.exports = mongoose.model('Lab', labSchema);
