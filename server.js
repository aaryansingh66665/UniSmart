import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory OTP storage
const otpStore = new Map(); // email -> { otp, expiresAt }

// API Route: Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email, smtpConfig } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes

  // Save to store
  otpStore.set(email.toLowerCase(), { otp, expiresAt });
  console.log(`Generated OTP ${otp} for email ${email}`);

  // Determine SMTP configuration
  const host = smtpConfig?.host || 'smtp.gmail.com';
  const port = parseInt(smtpConfig?.port || '587');
  const user = smtpConfig?.user;
  const pass = smtpConfig?.pass;

  if (!user || !pass) {
    return res.status(400).json({ 
      success: false, 
      error: 'SMTP user and password credentials are missing. Please configure them in Settings.' 
    });
  }

  try {
    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Email content
    const mailOptions = {
      from: `"UniSmart Security" <${user}>`,
      to: email,
      subject: 'UniSmart Secure Verification OTP Code',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #006591; padding: 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">UniSmart AI</h1>
            <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 14px;">Enterprise Security Verification</p>
          </div>
          <div style="padding: 32px; background-color: white;">
            <p style="margin-top: 0; font-size: 16px; color: #1f2937;">Hello,</p>
            <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">You are logging in to the UniSmart AI Management System. Please use the following 6-digit one-time password (OTP) code to complete your verification:</p>
            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #006591; font-family: monospace;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #9ca3af; text-align: center; margin-bottom: 0;">This code is valid for 5 minutes and can only be used once.</p>
          </div>
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-t: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; 2024 UniSmart AI Portal. Security Alert.</p>
          </div>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Verification OTP sent to your email.' });
  } catch (err) {
    console.error('Nodemailer Error:', err);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to send email. Details: ${err.message}. Make sure SMTP credentials are correct.` 
    });
  }
});

// API Route: Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP code are required.' });
  }

  const record = otpStore.get(email.toLowerCase());

  if (!record) {
    return res.status(400).json({ success: false, error: 'No verification request found for this email.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ success: false, error: 'Verification code has expired. Please send a new code.' });
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your email.' });
  }

  // Clear OTP on success
  otpStore.delete(email.toLowerCase());
  return res.status(200).json({ success: true, message: 'Verification successful.' });
});

// Serve built frontend assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for Single Page Application routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`UniSmart backend server running on http://localhost:${PORT}`);
});
