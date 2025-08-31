"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete("currentUser");
  redirect("/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("currentUser");
  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
}

export async function addAuditLog({
  user_name,
  user_email,
  actionType,
  targetType,
  targetId,
  description,
}) {
  try {
    const createdLog = await prisma.audit_logs.create({
      data: {
        user_name: user_name,
        user_email: user_email,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        description: description,
      },
    });
    console.log("Audit log created:", createdLog);
  } catch (error) {
    console.error("Failed to add audit log:", error);
  }
}

export async function verifyPassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function changePassword({ currentpassword, newpassword }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const dbUser = await prisma.users.findUnique({ where: { id: user.id } });

    if (!dbUser) {
      return { success: false, message: "User not found." };
    }

    const isValid = await verifyPassword(currentpassword, dbUser.password);
    if (!isValid) {
      return { success: false, message: "Current password is incorrect." };
    }

    const hashed = await hashPassword(newpassword);
    await prisma.users.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return { success: true, message: "Password changed successfully." };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while changing the password.",
    };
  }
}

export async function checkCurrentPassword(inputPassword) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const dbUser = await prisma.users.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return { success: false, message: "User not found." };
    }

    const isValid = await verifyPassword(inputPassword, dbUser.password);
    if (isValid) {
      return { success: true, message: "Password is correct." };
    } else {
      return { success: false, message: "Password is incorrect." };
    }
  } catch (error) {
    console.error("Check password error:", error);
    return {
      success: false,
      message: "An error occurred while checking the password.",
    };
  }
}

export async function getBookingsByMonth() {
  const result = await prisma.bookings.groupBy({
    by: ["created_at"],
    _count: { id: true },
  });

  const grouped = {};

  result.forEach((row) => {
    const date = new Date(row.created_at);
    const month = date.toLocaleString("default", { month: "long" });

    if (!grouped[month]) grouped[month] = 0;
    grouped[month] += row._count.id;
  });

  return Object.keys(grouped).map((month) => ({
    month,
    bookings: grouped[month],
  }));
}
