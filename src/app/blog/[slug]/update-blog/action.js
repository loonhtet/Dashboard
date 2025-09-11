"use server";

import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { addAuditLog } from "@/app/action";
import slugify from "slugify";
import { Messages } from "@/lib/message";

export async function getBlogBySlug(slug) {
  try {
    const blog = await prisma.blogs.findUnique({
      where: { slug },
    });

    if (!blog) {
      return {
        success: false,
        message: Messages.action.fetch.error(`${slug} blog`),
      };
    }

    return {
      success: true,
      data: blog,
      message: Messages.action.fetch.success(`${slug} blog`),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.fetch.error(`${slug} blog`),
    };
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
      action: "UPDATE",
      userId: currentUser?.id,
      details: `Updated blog: ${updatedBlog.title}`,
    });

    return {
      success: true,
      message: Messages.action.update.success("Blog"),
      data: updatedBlog,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.update.error("Blog"),
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
