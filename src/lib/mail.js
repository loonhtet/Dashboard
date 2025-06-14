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
      from: `"Dashboard" <${process.env.SMTP_USER}>`, // sender address
      to: to, // list of receivers
      subject: "OTP for Email Verification",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="text-align: center; color: #333;">Email Verification</h2>
          <p>Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for <span style="font-weight: 500;">1 minute</span>.</p>
          <p style="text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 10px; background-color: #f2f2f2; border-radius: 5px;">
            ${otp}
          </p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>Dashboard</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
