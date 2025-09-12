"use server";

import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";
import slugify from "slugify";

export async function getGalleryById(id) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!gallery) {
      return { success: false, message: "Gallery not found" };
    }

    return { success: true, data: gallery };
  } catch (error) {
    console.error("Get gallery by id error:", error);
    return { success: false, message: "Failed to fetch gallery" };
  }
}

export async function updateGallery({
  id,
  image,
  title,
  description,
  serviceId,
  currentUser,
}) {
  try {
    let imageUrl = null;

    // If a new file is uploaded, send to R2
    if (image && typeof image !== "string") {
      const uploaded = await uploadToR2(image);
      imageUrl = uploaded.url;
    } else {
      imageUrl = image; // keep existing image string
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        serviceId,
        image_url: imageUrl,
        slug: slugify(title, { lower: true, strict: true }),
      },
    });

    await addAuditLog({
      action: "UPDATE_GALLERY",
      userId: currentUser?.id,
      details: `Updated gallery: ${updatedGallery.title}`,
    });

    return {
      success: true,
      message: "Gallery updated successfully!",
      data: updatedGallery,
    };
  } catch (error) {
    console.error("Update gallery error:", error);
    return {
      success: false,
      message: error.message || "Failed to update gallery",
    };
  }
}

export async function getAllServices() {
  try {
    const services = await prisma.services.findMany();

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
