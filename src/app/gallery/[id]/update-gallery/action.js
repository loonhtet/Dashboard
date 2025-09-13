"use server";

import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";
import { Messages } from "@/lib/message";

export async function getGalleryById(id) {
  try {
    if (!id) {
      return { success: false, message: "Gallery ID is required" };
    }

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

    if (image && typeof image !== "string") {
      let uploadBody = image;

      if (image instanceof Blob) {
        const arrayBuffer = await image.arrayBuffer();
        uploadBody = Buffer.from(arrayBuffer);
      } else if (image?.pipe) {
        uploadBody = await new Promise((resolve, reject) => {
          const chunks = [];
          image.on("data", (chunk) => chunks.push(chunk));
          image.on("end", () => resolve(Buffer.concat(chunks)));
          image.on("error", reject);
        });
      }

      const bucket = process.env.R2_BUCKET_NAME;
      const key = `gallery/${Date.now()}-${image.name || "upload"}`;
      const uploaded = await uploadToR2(bucket, key, uploadBody);

      imageUrl = uploaded.url || uploaded;
    } else {
      imageUrl = image;
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        image_url: imageUrl,
        service: serviceId ? { connect: { id: serviceId } } : undefined,
      },
    });

    await addAuditLog({
      user_name: currentUser?.name || null,
      user_email: currentUser?.email || null,
      actionType: "UPDATE",
      targetType: "gallery",
      targetId: updatedGallery.id,
      description: `Gallery updated: ${updatedGallery.title}`,
    });

    return {
      success: true,
      message: Messages.action.update.success("Gallery"),
      data: updatedGallery,
    };
  } catch (error) {
    console.error("Update gallery error:", error);
    return {
      success: false,
      message: Messages.action.update.error("Gallery"),
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
