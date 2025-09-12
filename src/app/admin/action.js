"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";
import { Messages } from "@/lib/message";

export async function getAllAdmins(search) {
  try {
    const admins = await prisma.users.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
    });

    return {
      data: admins,
      success: true,
      message: Messages.action.fetch.success("Admin"),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.fetch.error("Admin"),
    };
  }
}

export async function deleteAdmin(id, currentUser) {
  try {
    const user = await prisma.users.findUnique({ where: { id } });

    await prisma.users.delete({ where: { id } });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "DELETE",
      targetType: "user",
      targetId: id,
      description: `Admin deleted: ${user?.name} (${user?.email})`,
    });

    return { success: true, message: Messages.action.delete.success("Admin") };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.delete.error("Admin"),
    };
  }
}

export async function updateAdmin({
  id,
  name,
  email,
  email_verified,
  currentUser,
}) {
  try {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return { success: false, message: "Admin not found." };
    }

    await prisma.users.update({
      where: { id },
      data: {
        name,
        email,
        email_verified,
      },
    });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "UPDATE",
      targetType: "user",
      targetId: id,
      description: `Admin updated: ${name} (${email})`,
    });

    return {
      success: true,
      message: "Admin account updated.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not update admin account. Check your connection or contact support.",
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
