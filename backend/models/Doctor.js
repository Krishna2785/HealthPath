const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  originalId: String,
  name: String,
  hospitalId: String,
  speciality: String,
  rating: Number,
  reviewsCount: Number,
  experience: String,
  fee: Number,
  image: String,
  about: String,
  availability: [String],
  timeSlots: [String],
  reviews: [{
    id: String,
    user: String,
    rating: Number,
    comment: String
  }]
});

module.exports = mongoose.model('Doctor', doctorSchema);
