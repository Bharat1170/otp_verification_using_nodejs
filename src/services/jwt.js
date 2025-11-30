// src/services/jwt.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const EXPIRES_IN = "7d"; // token validity

// Generate a JWT for a user
exports.generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
};

// Verify an incoming JWT
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // invalid or expired
  }
};
