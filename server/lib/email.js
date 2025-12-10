/**
 * Email Service Module
 * Uses NodeMailer for sending emails (password reset, verification, etc.)
 */

import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for plain text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email error:', error);
        throw new Error('Failed to send email');
    }
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendEmail({
        to: email,
        subject: 'Verify Your Email - Portfolio Admin',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #01b5f8;">Welcome to Portfolio Admin!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #01b5f8, #02569B); 
                  color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;
                  margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">
          Or copy and paste this link: <br>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `
    });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail({
        to: email,
        subject: 'Password Reset Request - Portfolio Admin',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #01b5f8;">Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #01b5f8, #02569B); 
                  color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;
                  margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `
    });
};

export default { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
