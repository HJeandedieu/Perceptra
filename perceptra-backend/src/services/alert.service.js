// src/services/alert.service.js
import sgMail from '@sendgrid/mail';
import config from '../config/config.js';

let twilioClient = null;

// Only initialize Twilio if credentials are valid
if (config.twilio.accountSid?.startsWith('AC') && config.twilio.authToken) {
  const { default: twilio } = await import('twilio');
  twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
}

// Only initialize SendGrid if API key is present
if (config.sendgrid.apiKey) {
  sgMail.setApiKey(config.sendgrid.apiKey);
}

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

export async function sendAlerts(event) {
  if (!config.alertSeverities.includes(event.severity)) return;

  const results = await Promise.allSettled([
    sendSMS(event),
    sendEmail(event),
  ]);

  results.forEach((result, i) => {
    const channel = i === 0 ? 'SMS' : 'Email';
    if (result.status === 'rejected') {
      console.error(`[alert] ${channel} failed: ${result.reason?.message}`);
    } else {
      console.log(`[alert] ${channel} sent for ${event.label} [${event.severity}]`);
    }
  });
}

// ------------------------------------------------------------------
// SMS — Twilio
// ------------------------------------------------------------------

async function sendSMS(event) {
  if (!twilioClient) {
    console.warn('[alert] Twilio not configured — skipping SMS');
    return;
  }

  const body = formatSMSBody(event);

  await twilioClient.messages.create({
    body,
    from: config.twilio.fromNumber,
    to:   config.twilio.toNumber,
  });
}

function formatSMSBody(event) {
  const time = new Date(event.timestamp).toLocaleTimeString();
  const who  = event.personName
    ? `Identified: ${event.personName}`
    : `Identity: ${event.identity || 'unknown'}`;

  return [
    `🚨 PERCEPTRA ALERT`,
    `Severity: ${event.severity.toUpperCase()}`,
    `Detected: ${event.label} (${Math.round(event.confidence * 100)}%)`,
    who,
    `Time: ${time}`,
    `Threat score: ${event.threatScore}`,
  ].join('\n');
}

// ------------------------------------------------------------------
// Email — SendGrid
// ------------------------------------------------------------------

async function sendEmail(event) {
  if (!config.sendgrid.apiKey) {
    console.warn('[alert] SendGrid API key missing — skipping email');
    return;
  }

  const msg = {
    to:      config.sendgrid.toEmail,
    from:    config.sendgrid.fromEmail,
    subject: `[${event.severity.toUpperCase()}] Perceptra Alert — ${event.label} detected`,
    html:    formatEmailHTML(event),
  };

  await sgMail.send(msg);
}

function formatEmailHTML(event) {
  const time       = new Date(event.timestamp).toLocaleString();
  const confidence = Math.round(event.confidence * 100);
  const who        = event.personName
    ? `<strong>${event.personName}</strong>`
    : event.identity || 'unknown';

  const severityColors = {
    critical: '#dc2626',
    high:     '#ea580c',
    medium:   '#ca8a04',
    low:      '#16a34a',
  };

  const color = severityColors[event.severity] || '#6b7280';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0f0f0f; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
          ⬡ PERCEPTRA
        </h1>
        <p style="color: #9ca3af; margin: 4px 0 0;">AI Surveillance Alert</p>
      </div>

      <div style="background: #1a1a1a; padding: 24px; border-left: 4px solid ${color};">
        <div style="display: inline-block; background: ${color}; color: white;
                    padding: 4px 12px; border-radius: 4px; font-weight: bold;
                    text-transform: uppercase; font-size: 14px; margin-bottom: 16px;">
          ${event.severity}
        </div>

        <table style="width: 100%; border-collapse: collapse; color: #e5e7eb;">
          <tr>
            <td style="padding: 8px 0; color: #9ca3af; width: 140px;">Detected</td>
            <td style="padding: 8px 0; font-weight: bold;">${event.label}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Confidence</td>
            <td style="padding: 8px 0;">${confidence}%</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Identity</td>
            <td style="padding: 8px 0;">${who}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Threat Score</td>
            <td style="padding: 8px 0;">${event.threatScore}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Loiter Time</td>
            <td style="padding: 8px 0;">${event.loiterSeconds}s</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Time</td>
            <td style="padding: 8px 0;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Frame</td>
            <td style="padding: 8px 0;">#${event.frameId}</td>
          </tr>
        </table>
      </div>

      <div style="background: #0f0f0f; padding: 16px 24px; border-radius: 0 0 8px 8px;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          This is an automated alert from Perceptra AI Surveillance System.
          Do not reply to this email.
        </p>
      </div>
    </div>
  `;
}