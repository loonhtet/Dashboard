"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function loginUser({ email, password }) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Email not found." };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return { success: false, message: "Incorrect password." };
    }

    // Set cookie (optional but recommended)
    cookies().set(
      "currentUser",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
      }),
    );

    return { success: true, message: "Login successful.", user };
  } catch (error) {
    console.error("Login Error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
