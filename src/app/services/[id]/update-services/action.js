"use server";

import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";
import { Messages } from "@/lib/message";
import slugify from "slugify";

export async function getServiceById(id) {
  try {
    if (!id) {
      return { success: false, message: "Service ID is required" };
    }

    const service = await prisma.services.findUnique({
      where: { id },
      include: {
        gallery: true,
      },
    });

    if (!service) {
      return { success: false, message: "Service not found" };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("Get service by id error:", error);
    return { success: false, message: "Failed to fetch service" };
  }
}

export async function updateService({ 
  id,
  image,
  title,
  description,
  currentUser,
}) {
  try {
    if (!id) throw new Error("Service ID is required");

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
      const key = `services/${Date.now()}-${image.name || "service"}.jpg`;
      const uploaded = await uploadToR2(bucket, key, uploadBody);
      imageUrl = uploaded.url || uploaded;
    } else {
      imageUrl = image;
    }

    const slug = slugify(title || "service", { lower: true, strict: true });
    const updateService = await prisma.services.update({
      where: { id },
      data: {
        title,
        description,
        image_url: imageUrl,
        slug,
        updated_at: new Date(),
      },
    });

    if (imageUrl) {
      try {
        await prisma.gallery.create({
          data: {
            title,
            description,
            image_url: imageUrl,
            serviceId: id,
          },
        });
      } catch (galleryError) {
        console.error("Error creating gallery entry:", galleryError);
      }
    }

    await addAuditLog({
      user_name: currentUser?.name || null,
      user_email: currentUser?.email || null,
      actionType: "UPDATE",
      targetType: "service",
      targetId: updateService.id,
      description: `Service updated: ${updateService.title}`,
    });

    return {
      success: true,
      message: "Service updated successfully",
      data: updateService,
    };
  } catch (error) {
    console.error("Update service error:", error);
    return {
      success: false,
      message: "Failed to update service",
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
