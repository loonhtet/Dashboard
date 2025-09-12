"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";
import { Messages } from "@/lib/message";

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
      message: Messages.action.fetch.success("Booking"),
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
      message: Messages.action.fetch.error("Booking"),
    };
  }
}

export async function deleteBooking(id, currentUser) {
  try {
    const booking = await prisma.bookings.findUnique({ where: { id } });

    if (!booking) {
      return {
        success: false,
        message: Messages.action.fetch.error("Booking"),
      };
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

    return { success: true, message: Messages.action.delete.error("Booking") };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.delete.error("Booking"),
    };
  }
}

export async function deleteOldBookings(currentUser) {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const oldBookings = await prisma.bookings.findMany({
      where: {
        created_at: { lt: oneMonthAgo },
      },
    });

    if (oldBookings.length === 0) {
      return { success: true, message: "No bookings older than one month." };
    }

    await prisma.bookings.deleteMany({
      where: {
        created_at: { lt: oneMonthAgo },
      },
    });

    for (const booking of oldBookings) {
      await addAuditLog({
        user_name: currentUser.name || null,
        user_email: currentUser.email || null,
        actionType: "DELETE",
        targetType: "booking",
        targetId: booking.id,
        description: `Booking deleted (older than 1 month): ${booking.full_name} (${booking.email_address})`,
      });
    }

    return {
      success: true,
      message: Messages.action.delete.success(
        `${oldBookings.length} old bookings`,
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.delete.error(
        `${oldBookings.length} old bookings`,
      ),
    };
  }
}
