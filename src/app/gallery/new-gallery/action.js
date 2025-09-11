"use server";

import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";
import slugify from "slugify";

export async function createGallery({
  image,
  title,
  description,
  serviceId,
  currentUser,
}) {
  try {
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: "en",
    });

    let image_url;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const key = `galleries/${slug}-${Date.now()}.png`;
      image_url = await uploadToR2(process.env.R2_BUCKET_NAME, key, buffer);
    }

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        description,
        image_url,
        serviceId,
      },
    });

    await addAuditLog({
      user_name: currentUser?.name || null,
      user_email: currentUser?.email || null,
      actionType: "CREATE",
      targetType: "gallery",
      targetId: newGallery.id,
      description: `Gallery item created: ${title}`,
    });

    return {
      success: true,
      message: "Gallery item created successfully.",
      data: newGallery,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not create gallery item. Check your connection or contact support.",
    };
  }
}
