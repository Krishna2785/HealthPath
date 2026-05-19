const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  originalId: String, // Keeping original id to map existing mock data references easily
  name: String,
  rating: Number,
  type: String,
  status: String,
  distance: Number,
  distanceStr: String,
  image: String,
  specialities: [String],
  timings: String
});

module.exports = mongoose.model('Hospital', hospitalSchema);
