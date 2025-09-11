"use server";

import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";

export async function createService({
  image,
  title,
  description,
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
      const key = `services/${slug}-${Date.now()}.png`;
      image_url = await uploadToR2(process.env.R2_BUCKET_NAME, key, buffer);
    }

    const newService = await prisma.services.create({
      data: {
        slug,
        image_url,
        title,
        description,
      },
    });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
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
        "Could not create Service. Check your connection or contact support.",
    };
  }
}
