const mongoose = require('mongoose');

const donationOrgSchema = new mongoose.Schema({
  originalId: String,
  name: String,
  type: String,
  focus: String,
  verified: Boolean,
  logo: String
});

module.exports = mongoose.model('DonationOrg', donationOrgSchema);
