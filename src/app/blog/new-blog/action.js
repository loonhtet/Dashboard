"use server";

import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";
import { Messages } from "@/lib/message";

export async function createBlog({
  thumbnail,
  title,
  description,
  content,
  published = false,
  categoryId,
  currentUser,
}) {
  try {
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: "en",
    });

    let thumbnailURL;

    if (thumbnail) {
      const arrayBuffer = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const key = `blogs/${slug}-${Date.now()}.png`;
      thumbnailURL = await uploadToR2(process.env.R2_BUCKET_NAME, key, buffer);
    }

    const newBlog = await prisma.blogs.create({
      data: {
        slug,
        thumbnail: thumbnailURL,
        title,
        description,
        content,
        published,
        categoryId,
      },
    });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "CREATE",
      targetType: "blog",
      targetId: newBlog.id,
      description: `Blog created: ${title}`,
    });

    return {
      success: true,
      message: Messages.action.create.success("Blog"),
      data: newBlog,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.create.error("Blog"),
    };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.categories.findMany();

    return {
      success: true,
      data: categories,
      message: Messages.action.fetch.success("Category"),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: Messages.action.fetch.error("Category"),
    };
  }
}
