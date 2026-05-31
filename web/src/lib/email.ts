import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465');
const smtpSecure = process.env.SMTP_SECURE !== 'false'; // true by default (TLS)
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM || '"SICE" <apply@thesice.com>';

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using Nodemailer and SMTP.
 * If credentials are not configured, it gracefully falls back to console logging
 * so that the main application APIs do not fail.
 */
export async function sendMail({ to, subject, html }: SendMailParams) {
  if (!smtpUser || !smtpPassword) {
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log(`│ [MOCK EMAIL LOGGER]                                    │`);
    console.log(`│ TO:      %-45s │`, to);
    console.log(`│ SUBJECT: %-45s │`, subject);
    console.log('├────────────────────────────────────────────────────────┤');
    // Print a brief plain text summary of the HTML content to keep terminal readable
    const textPreview = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150);
    console.log(`│ PREVIEW: %-45s...│`, textPreview);
    console.log('└────────────────────────────────────────────────────────┘\n');
    return { success: true, mock: true };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
    });
    console.log(`[SMTP] Email successfully sent to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[SMTP] Failed to send email via SMTP server:', error);
    return { success: false, error };
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* Branded HTML Templates                                             */
/* ────────────────────────────────────────────────────────────────── */

const GOLD = '#C9A84C';
const NAVY_DARK = '#080D26';
const CARD_BG = '#0B1333';
const TEXT_MUTED = '#A2A8C2';

/**
 * Base layout wrapper for emails to ensure uniform styling.
 */
function wrapLayout(title: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: ${NAVY_DARK}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${NAVY_DARK}; min-height: 100vh; padding: 40px 20px;">
          <tr>
            <td align="center" valign="top">
              <!-- Outer Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${CARD_BG}; border: 1px solid rgba(240, 235, 224, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                
                <!-- Logo Header -->
                <tr>
                  <td align="center" style="padding: 40px 40px 20px 40px;">
                    <div style="font-size: 28px; font-weight: 900; color: ${GOLD}; letter-spacing: 4px; font-family: system-ui, -apple-system, sans-serif;">
                      SICE
                    </div>
                    <div style="font-size: 10px; font-weight: bold; color: ${TEXT_MUTED}; letter-spacing: 3px; margin-top: 5px; text-transform: uppercase;">
                      The South Indian Creator Economy
                    </div>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 20px 40px 40px 40px; font-size: 14px; line-height: 1.6; color: #FFFFFF;">
                    ${bodyContent}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 30px 40px; background-color: rgba(255, 255, 255, 0.02); border-top: 1px solid rgba(240, 235, 224, 0.05); font-size: 11px; color: ${TEXT_MUTED}; line-height: 1.5;">
                    <p style="margin: 0; font-weight: bold; color: ${GOLD};">SICE | The South Indian Creator Economy</p>
                    <p style="margin: 5px 0 0 0;">This is an automated operational notification regarding your account state.</p>
                    <p style="margin: 5px 0 0 0;">&copy; 2026 SICE. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * 1. Application Confirmation Template
 */
export function generateApplicationEmail(fullName: string, applicationType: string): string {
  const typeLabel = applicationType === 'creator' 
    ? 'Content Creator Roster' 
    : applicationType === 'merchant' 
      ? 'Brand / Merchant Portal' 
      : 'Local Chapter Representative';

  const body = `
    <h2 style="font-size: 20px; font-weight: bold; color: ${GOLD}; margin-top: 0; margin-bottom: 20px; text-align: center;">
      Application Received
    </h2>
    <p style="margin-top: 0;">Hi <strong>${fullName}</strong>,</p>
    <p>Thank you for submitting your application to join the **SICE (South Indian Creator Economy)** under the <strong>${typeLabel}</strong> category.</p>
    <p>Our administrative board is currently reviewing your details, social media footprints, and compliance indexes. The standard verification window is <strong>24 to 48 hours</strong>.</p>
    
    <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: ${TEXT_MUTED};">Application Status</p>
      <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #EAB308;">PENDING REVIEW</p>
    </div>

    <p>No further action is required from you at this time. Once your application is reviewed and activated, you will receive an automated email containing your login details and instructions to access the SICE dashboard.</p>
    
    <p style="margin-bottom: 0; margin-top: 30px;">
      Warm regards,<br>
      <strong>The SICE Admin Board</strong>
    </p>
  `;

  return wrapLayout('SICE Application Received', body);
}

/**
 * 2. Account Activation / Approval / Login Details Template
 */
export function generateActivationEmail(
  fullName: string, 
  role: string, 
  email: string, 
  temporaryPassword?: string
): string {
  const roleLabel = role === 'creator' 
    ? 'Verified Content Creator' 
    : role === 'merchant' 
      ? 'Partner Merchant / Brand' 
      : 'Chapter Administrator';

  let credentialsSection = '';
  if (temporaryPassword) {
    credentialsSection = `
      <div style="background-color: rgba(201, 168, 76, 0.05); border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 16px; padding: 20px; margin: 25px 0;">
        <h4 style="margin: 0 0 10px 0; color: ${GOLD}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Login Credentials</h4>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: ${TEXT_MUTED};" width="120">Login Email:</td>
            <td style="padding: 4px 0; color: #FFFFFF; font-weight: bold; font-family: monospace;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: ${TEXT_MUTED};">Temp Password:</td>
            <td style="padding: 4px 0; color: #FFFFFF; font-weight: bold; font-family: monospace;">${temporaryPassword}</td>
          </tr>
        </table>
        <p style="margin: 15px 0 0 0; font-size: 11px; color: ${TEXT_MUTED}; font-style: italic;">
          * For security, you will be prompted to change this temporary password upon your first login.
        </p>
      </div>
    `;
  } else {
    credentialsSection = `
      <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 20px; margin: 25px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: ${TEXT_MUTED};" width="120">Registered Email:</td>
            <td style="padding: 4px 0; color: #FFFFFF; font-weight: bold; font-family: monospace;">${email}</td>
          </tr>
        </table>
        <p style="margin: 10px 0 0 0; font-size: 11px; color: ${TEXT_MUTED};">
          Please log in using the credentials you selected during sign-up or activation.
        </p>
      </div>
    `;
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/login`;

  const body = `
    <h2 style="font-size: 20px; font-weight: bold; color: ${GOLD}; margin-top: 0; margin-bottom: 20px; text-align: center;">
      Welcome to SICE!
    </h2>
    <p style="margin-top: 0;">Hi <strong>${fullName}</strong>,</p>
    <p>Congratulations! Your application has been approved and your profile has been successfully activated as a <strong>${roleLabel}</strong> in the SICE ecosystem.</p>
    
    ${credentialsSection}

    <div align="center" style="margin: 30px 0;">
      <a href="${loginUrl}" target="_blank" style="background: linear-gradient(135deg, ${GOLD} 0%, #a88a3a 100%); color: #080D26; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 13px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(201,168,76,0.3); transition: transform 0.2s;">
        Log In to Dashboard
      </a>
    </div>

    <p>We are excited to have you onboard. In your SICE Dashboard, you can edit your profile details, check local chapter events, track metrics, and connect with brand campaigns.</p>

    <p style="margin-bottom: 0; margin-top: 30px;">
      Welcome to the community,<br>
      <strong>The SICE Team</strong>
    </p>
  `;

  return wrapLayout('Welcome to SICE - Account Activated', body);
}

/**
 * 3. Password Reset / Update Template
 */
export function generatePasswordResetEmail(
  fullName: string, 
  email: string, 
  newPassword: string
): string {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/login`;

  const body = `
    <h2 style="font-size: 20px; font-weight: bold; color: ${GOLD}; margin-top: 0; margin-bottom: 20px; text-align: center;">
      Password Reset Complete
    </h2>
    <p style="margin-top: 0;">Hi <strong>${fullName}</strong>,</p>
    <p>This email confirms that the login password for your SICE account was successfully updated by an administrator.</p>
    
    <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 20px; margin: 25px 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
        <tr>
          <td style="padding: 4px 0; color: ${TEXT_MUTED};" width="120">Username/Email:</td>
          <td style="padding: 4px 0; color: #FFFFFF; font-weight: bold; font-family: monospace;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: ${TEXT_MUTED};">New Password:</td>
          <td style="padding: 4px 0; color: #FFFFFF; font-weight: bold; font-family: monospace;">${newPassword}</td>
        </tr>
      </table>
    </div>

    <div align="center" style="margin: 30px 0;">
      <a href="${loginUrl}" target="_blank" style="background: linear-gradient(135deg, ${GOLD} 0%, #a88a3a 100%); color: #080D26; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 13px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(201,168,76,0.3);">
        Log In Now
      </a>
    </div>

    <p style="color: ${TEXT_MUTED}; font-size: 12px;">
      If you did not request this change, please contact a SICE system administrator immediately to secure your account.
    </p>

    <p style="margin-bottom: 0; margin-top: 30px;">
      Best regards,<br>
      <strong>SICE Support</strong>
    </p>
  `;

  return wrapLayout('SICE Password Reset Complete', body);
}

/**
 * Generates an 8-character long password containing a mix of:
 * uppercase letters, lowercase letters, numbers, and symbols.
 */
export function generateSecurePassword(): string {
  const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const smalls = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+';
  
  // Ensure at least one of each to guarantee complexity requirement is met
  let password = '';
  password += caps[Math.floor(Math.random() * caps.length)];
  password += smalls[Math.floor(Math.random() * smalls.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  const allChars = caps + smalls + numbers + symbols;
  for (let i = 0; i < 4; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle characters randomly
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

