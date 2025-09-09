"use server";

import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";
import slugify from "slugify";

export async function getBlogBySlug(slug) {
  try {
    const blog = await prisma.blogs.findUnique({
      where: { slug },
    });

    if (!blog) {
      return { success: false, message: "Blog not found" };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error("Get blog by slug error:", error);
    return { success: false, message: "Failed to fetch blog" };
  }
}

export async function updateBlog({
  id,
  thumbnail,
  title,
  description,
  content,
  categoryId,
  currentUser,
}) {
  try {
    let thumbnailUrl = null;

    if (thumbnail && typeof thumbnail !== "string") {
      const uploaded = await uploadToR2(thumbnail);
      thumbnailUrl = uploaded.url;
    } else {
      thumbnailUrl = thumbnail;
    }

    const updatedBlog = await prisma.blogs.update({
      where: { id },
      data: {
        title,
        description,
        content,
        categoryId,
        thumbnail: thumbnailUrl,
        slug: slugify(title, { lower: true, strict: true }),
      },
    });

    await addAuditLog({
      action: "UPDATE_BLOG",
      userId: currentUser?.id,
      details: `Updated blog: ${updatedBlog.title}`,
    });

    return {
      success: true,
      message: "Blog updated successfully!",
      data: updatedBlog,
    };
  } catch (error) {
    console.error("Update blog error:", error);
    return {
      success: false,
      message: error.message || "Failed to update blog",
    };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.categories.findMany();

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message:
        "Could not fetch categories. Check your connection or contact support.",
    };
  }
}
