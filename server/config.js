let env = require('dotenv').config();
module.exports = {
  twilio: {
    accountSid: env.parsed.TWILIO_ACCOUNT_SID,
    apiKey: env.parsed.TWILIO_API_KEY,
    apiSecret: env.parsed.TWILIO_API_SECRET,
    chatService: process.env.TWILIO_CHAT_SERVICE_SID,
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: process.env.TWILIO_ALLOW_INCOMING_CALLS === "true"
  }
};

