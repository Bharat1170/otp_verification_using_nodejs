// src/models/user.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// sub-schema for verification data
const VerificationSchema = new Schema({
  code: { type: String },
  createdAt: { type: Date }
}, { _id: false });

// main user schema
const UserSchema = new Schema({
  email: { type: String, index: true, sparse: true },
  phone: { type: String, index: true, sparse: true }, // don't force unique for now
  phoneVerified: { type: Boolean, default: false },
  verification: { type: VerificationSchema }
}, {
  timestamps: true
});

module.exports = model('User', UserSchema);
