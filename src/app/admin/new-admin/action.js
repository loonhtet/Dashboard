"use server";

import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/mail";
import { addAuditLog } from "@/app/action";
import { prisma } from "@/lib/prisma";

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

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "CREATE",
      targetType: "user",
      targetId: newUser.id,
      description: `Admin created: ${name} (${email})`,
    });

    return {
      success: true,
      message: Messages.action.create.success(`${name}`),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.create.error(`${name}`),
    };
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
      return { success: false, message: Messages.otp.send.providerError };
    }

    return { success: true, message: Messages.otp.send.success };
  } catch (error) {
    console.error(error);
    return { success: false, message: Messages.otp.send.error };
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
      return { success: false, message: Messages.otp.verify.invalid };
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return {
        success: false,
        message: Messages.otp.verify.expired,
      };
    }

    await prisma.user_otps.delete({
      where: { id: otpRecord.id },
    });

    return { success: true, message: "Email has been verified successfully!" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.otp.verify.error,
    };
  }
}
