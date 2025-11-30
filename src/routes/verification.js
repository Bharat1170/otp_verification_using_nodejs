// src/routes/verification.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { sendVerification, checkVerification } = require('../services/twilio');

// OTP expiry time: 2 minutes = 120 seconds
const OTP_EXPIRY_MS = 2 * 60 * 1000;

  //  SEND VERIFICATION CODE

router.post('/request', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    // find or create user
    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone });

    // store createdAt for manual expiry logic
    user.verification = {
      createdAt: new Date()     // store time when OTP was sent
    };
    await user.save();

    // send SMS using Twilio Verify
    await sendVerification(phone);

    return res.json({ ok: true, message: 'Verification code sent' });
  } catch (err) {
    console.error('Twilio send error:', err.message || err);
    return res.status(500).json({ error: 'Failed to send code' });
  }
});

  //  CONFIRM VERIFICATION CODE (with expiry check)
  
router.post('/confirm', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code)
      return res.status(400).json({ error: 'Phone & code required' });

    // find user
    const user = await User.findOne({ phone });
    if (!user || !user.verification)
      return res.status(400).json({ error: 'No code requested' });

    // ---- EXPIRY CHECK ----
    const ageMs =
      Date.now() - new Date(user.verification.createdAt).getTime();

    if (ageMs > OTP_EXPIRY_MS) {
      user.verification = undefined;
      await user.save();
      return res.status(400).json({ error: 'OTP expired. Please request a new code.' });
    }

    // ---- TWILIO VERIFY CHECK ----
    const result = await checkVerification(phone, code);
    if (!result || result.status !== 'approved') {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    // mark phone verified
    user.phoneVerified = true;
    user.verification = undefined;
    await user.save();

    return res.json({ ok: true, message: 'Phone verified' });
  } catch (err) {
    console.error('Twilio check error:', err.message || err);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
