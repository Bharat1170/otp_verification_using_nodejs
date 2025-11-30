// src/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../services/jwt');

/**
 * POST /auth/token
 * Body: { phone: "+..." }
 * Issues a JWT if the user exists and phone is verified.
 * (Simple, test-friendly endpoint.)
 */
router.post('/token', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: 'phone is required' });

    const user = await User.findOne({ phone }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.phoneVerified) return res.status(403).json({ error: 'Phone not verified' });

    const token = generateToken(user._id.toString());
    return res.json({ ok: true, token });
  } catch (err) {
    console.error('Auth token error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Could not create token' });
  }
});

/**
 * Optional: POST /auth/register (create user without verification)
 * Body: { phone: "+..." }
 */
router.post('/register', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: 'phone is required' });

    const existing = await User.findOne({ phone });
    if (existing) return res.json({ ok: true, message: 'User exists', userId: existing._id });

    const user = await User.create({ phone });
    return res.json({ ok: true, userId: user._id });
  } catch (err) {
    console.error('Auth register error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
