const mongoose = require('mongoose');

const organPledgeSchema = new mongoose.Schema({
  pledgeId: String,
  orgId: String,
  name: String,
  email: String,
  phone: String,
  bloodGroup: String,
  pledgeType: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrganPledge', organPledgeSchema);
