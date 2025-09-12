import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
// This object is what actually sends the mail.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Email user
    pass: process.env.SMTP_PASS, // Email password or app password
  },
});

export async function sendVerificationEmail(to, otp) {
  try {
    await transporter.sendMail({
      from: `"Dashboard" <${process.env.SMTP_USER}>`,
      to: to,
      subject: "OTP for Email Verification",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background-color: #fdfaf8; border: 1px solid #e5ded7; border-radius: 12px; padding: 32px; color: #3b2f2f;">

          <!-- Header -->
          <h2 style="text-align: center; font-weight: 600; color: #2e2a27; margin-bottom: 8px;">
            Email Verification
          </h2>
          <p style="text-align: center; font-size: 14px; color: #7a6f6f; margin-bottom: 24px;">
            Secure your account with a one-time password
          </p>

          <!-- OTP Box -->
          <div style="text-align: center; background-color: #f5eee9; padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #2e2a27; margin: 0;">
              ${otp}
            </p>
          </div>
          <p style="text-align: center; font-size: 14px; color: #7a6f6f; margin-bottom: 32px;">
            This OTP is valid for <strong>1 minute</strong>.
          </p>

          <!-- Info -->
          <p style="font-size: 14px; color: #5c5454;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <!-- Footer -->
          <p style="margin-top: 32px; text-align: center; font-size: 13px; color: #8a7f7f;">
            Best regards, <br/>
            <strong style="color: #3b2f2f;">Dashboard Team</strong>
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
