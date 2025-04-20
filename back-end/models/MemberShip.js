const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema({
  membershipName: {
    type: String,
    required: true,
    unique: true
  },
  membershipDescription: {
    type: String,
    required: true
  },
  membershipType: {
    type: String,
    required: true
  },
  membershipPhoto: {
    type: String, 
    required: false
  },
  membershipPeriod: {
    type: String, 
    required: true
  },
  isJoinFee: {
    type: Boolean,
    default: false
  },
  charge: {
    type: Number, 
    required: true
  },
  isStartDateOfPurches: {
    type: Boolean,
    default: false
  },
  cancellationPolicy: {
    type: String,
    required: true
  },
  cancellationDuration: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Membership", MembershipSchema);
