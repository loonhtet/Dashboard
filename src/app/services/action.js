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

export async function createService({ title, description, currentUser }) {
  try {
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: "en",
    });

    const newService = await prisma.services.create({
      data: {
        title,
        description,
        slug,
      },
    });

    await addAuditLog({
      user_name: currentUser?.name || null,
      user_email: currentUser?.email || null,
      actionType: "CREATE",
      targetType: "service",
      targetId: newService.id,
      description: `Service created: ${title}`,
    });

    return {
      success: true,
      message: "Service created successfully.",
      data: newService,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not create service. Check your connection or contact support.",
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

export async function updateService({ id, title, description, currentUser }) {
  try {
    const service = await prisma.services.findUnique({ where: { id } });
    if (!service) {
      return { success: false, message: "Service not found." };
    }

    await prisma.services.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    await addAuditLog({
      user_name: currentUser?.name || null,
      user_email: currentUser?.email || null,
      actionType: "UPDATE",
      targetType: "service",
      targetId: id,
      description: `Service updated: ${title}`,
    });

    return {
      success: true,
      message: "Service updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not update service. Check your connection or contact support.",
    };
  }
}
