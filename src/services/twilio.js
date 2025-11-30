// src/services/twilio.js
require('dotenv').config();
const twilio = require('twilio');

const SID = (process.env.TWILIO_ACCOUNT_SID || '').trim();
const TOKEN = (process.env.TWILIO_AUTH_TOKEN || '').trim();
const VERIFY_ID = (process.env.TWILIO_VERIFY_SERVICE_ID || '').trim();

if (!SID || !TOKEN) {
  throw new Error('Twilio env vars missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
}
if (!SID.startsWith('AC')) {
  console.warn('TWILIO_ACCOUNT_SID does not start with "AC". Are you using an API Key (SK...) by mistake?');
}

const client = twilio(SID, TOKEN);

async function testClient() {
  try {
    const acc = await client.api.accounts(SID).fetch();
    console.log('Twilio account ok:', acc.sid);
  } catch (e) {
    console.error('Twilio SDK error (testClient):', e.message);
  }
}
testClient(); // runs once at startup for visibility

exports.sendVerification = (phone) => {
  if (!VERIFY_ID) throw new Error('TWILIO_VERIFY_SERVICE_ID not set in .env');
  return client.verify.v2.services(VERIFY_ID).verifications.create({ to: phone, channel: 'sms' });
};

exports.checkVerification = (phone, code) => {
  if (!VERIFY_ID) throw new Error('TWILIO_VERIFY_SERVICE_ID not set in .env');
  return client.verify.v2.services(VERIFY_ID).verificationChecks.create({ to: phone, code });
};
