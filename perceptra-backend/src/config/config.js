// src/config/config.js
import "dotenv/config";

const config = {
  // ---------------------------------------------------------------
  // Server
  // ---------------------------------------------------------------
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",

  // ---------------------------------------------------------------
  // Database
  // ---------------------------------------------------------------
  databaseUrl: process.env.DATABASE_URL,

  // ---------------------------------------------------------------
  // JWT
  // ---------------------------------------------------------------
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // ---------------------------------------------------------------
  // Twilio
  // ---------------------------------------------------------------
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_PHONE_NUMBER,
    toNumber: process.env.ALERT_PHONE_NUMBER,
  },

  // ---------------------------------------------------------------
  // SendGrid
  // ---------------------------------------------------------------
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
    toEmail: process.env.ALERT_EMAIL,
  },

  // ---------------------------------------------------------------
  // Client
  // ---------------------------------------------------------------
  clientUrl: process.env.CLIENT_URL,

  // ---------------------------------------------------------------
  // Alert thresholds
  // ---------------------------------------------------------------
  alertSeverities: (process.env.ALERT_SEVERITIES || "high,critical")
    .split(",")
    .map((s) => s.trim()),
};

// ---------------------------------------------------------------
// Validate required env vars at startup — fail fast if missing
// ---------------------------------------------------------------
const REQUIRED = ["DATABASE_URL", "JWT_SECRET", "CLIENT_URL"];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `[config] Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

export default config;
