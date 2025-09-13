"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";

export async function getAllGallery(search = "") {
  try {
    const galleries = await prisma.gallery.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
      include: {
        service: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, data: galleries };
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return {
      success: false,
      message:
        "Could not fetch gallery items. Check your connection or contact support.",
    };
  }
}


export async function deleteGallery(id, currentUser) {
  try {
    const gallery = await prisma.gallery.findUnique({ where: { id } });
    if (!gallery) {
      return { success: false, message: "Gallery item not found." };
    }

    await prisma.gallery.delete({ where: { id } });

    await addAuditLog({
      user_name: currentUser?.name || null,
      user_email: currentUser?.email || null,
      actionType: "DELETE",
      targetType: "gallery",
      targetId: id,
      description: `Gallery item deleted: ${gallery.title}`,
    });

    return { success: true, message: "Gallery item successfully deleted." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not delete gallery item. Check your connection or contact support.",
    };
  }
}

export async function updateGallery({
  id,
  title,
  description,
  image_url,
  serviceId,
  currentUser,
}) {
  try {
    const gallery = await prisma.gallery.findUnique({ where: { id } });
    if (!gallery) {
      return { success: false, message: "Gallery item not found." };
    }

    await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        image_url,
        serviceId,
      },
    });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "UPDATE",
      targetType: "gallery",
      targetId: id,
      description: `Gallery item updated: ${title}`,
    });

    return {
      success: true,
      message: "Gallery item updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not update gallery item. Check your connection or contact support.",
    };
  }
}
