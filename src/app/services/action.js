"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";
import slugify from "slugify";

export async function getAllServices(search = "") {
  try {
    const services = await prisma.services.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: {
        created_at: "desc",
      },
      include: {
        gallery: true,
      },
    });

    return { success: true, data: services };
  } catch (error) {
    console.error("Error fetching services:", error);
    return {
      success: false,
      message:
        "Could not fetch services. Check your connection or contact support.",
    };
  }
}


export async function deleteService(id, currentUser) {
  try {
    const service = await prisma.services.findUnique({ where: { id } });
    if (!service) {
      return { success: false, message: "Service not found." };
    }

    await prisma.services.delete({ where: { id } });

    await addAuditLog({
      user_name: currentUser?.name || null,
      user_email: currentUser?.email || null,
      actionType: "DELETE",
      targetType: "service",
      targetId: id,
      description: `Service deleted: ${service?.title}`,
    });

    return { success: true, message: "Service successfully deleted." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not delete service. Check your connection or contact support.",
    };
  }
}

