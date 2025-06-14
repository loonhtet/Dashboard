"use server";

import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { addAuditLog } from "@/app/action";

export async function createAdmin({
  name,
  email,
  password,
  email_verified = false,
  currentUser,
}) {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        email_verified,
      },
    });

    // Add audit log record
    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "CREATE",
      targetType: "user",
      targetId: newUser.id,
      description: `Admin created: ${name} (${email})`,
    });

    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error("Admin create failed");
  }
}

function generateNumericOtp(length = 6) {
  let otp = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export async function sendOtp(email) {
  const otp = generateNumericOtp(6);
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

  try {
    await prisma.user_otps.create({
      data: {
        user_email: email,
        otp_code: otp,
        expires_at: expiresAt,
      },
    });

    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) {
      throw new Error("The email provider failed to send the OTP.");
    }

    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error in sendOtp function:", error);
    return { success: false, message: "Failed to send OTP." };
  }
}

export async function verifyOtp(email, otp) {
  try {
    const otpRecord = await prisma.user_otps.findFirst({
      where: {
        user_email: email,
        otp_code: otp,
      },
    });

    if (!otpRecord) {
      return { success: false, message: "Invalid OTP." };
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      };
    }

    await prisma.user_otps.delete({
      where: { id: otpRecord.id },
    });

    return { success: true, message: "Email has been verified successfully!" };
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
