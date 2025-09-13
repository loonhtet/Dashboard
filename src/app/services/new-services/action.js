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

    let image_url = null;

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
      const key = `services/${slug}-${Date.now()}.jpg`;
      const uploaded = await uploadToR2(bucket, key, uploadBody);
      image_url = uploaded.url || uploaded;
    } else {
      image_url = image;
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
