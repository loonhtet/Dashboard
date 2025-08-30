"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";

export async function getAllBookings(search, page = 1, pageSize = 10) {
  try {
    const skip = (page - 1) * pageSize;

    const whereCondition = search
      ? {
          OR: [
            { full_name: { contains: search, mode: "insensitive" } },
            { phone_number: { contains: search, mode: "insensitive" } },
            { service: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;

    const bookings = await prisma.bookings.findMany({
      where: whereCondition,
      skip: skip,
      take: pageSize,
      orderBy: {
        created_at: "desc",
      },
    });

    const totalBookings = await prisma.bookings.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalBookings / pageSize);

    return {
      data: bookings,
      success: true,
      message: "Bookings data fetched.",
      pagination: {
        totalItems: totalBookings,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not fetch bookings data. Check your connection or contact support.",
    };
  }
}

export async function deleteBooking(id, currentUser) {
  try {
    const booking = await prisma.bookings.findUnique({ where: { id } });

    if (!booking) {
      return { success: false, message: "Booking not found." };
    }

    await prisma.bookings.delete({ where: { id } });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "DELETE",
      targetType: "booking",
      targetId: id,
      description: `Booking deleted: ${booking.full_name} (${booking.email_address})`,
    });

    return { success: true, message: "Booking successfully deleted." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not delete booking. Check your connection or contact support.",
    };
  }
}
