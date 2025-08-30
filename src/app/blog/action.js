"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";
import slugify from "slugify";

export async function getAllBlogs(search = "") {
  try {
    const blogs = await prisma.blogs.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, data: blogs };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      message:
        "Could not fetch blogs. Check your connection or contact support.",
    };
  }
}

export async function createBlog({
  title,
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

    const newBlog = await prisma.blogs.create({
      data: {
        title,
        content,
        published,
        slug,
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
      message: "Blog created successfully.",
      data: newBlog,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not create Blog. Check your connection or contact support.",
    };
  }
}

export async function deleteBlog(id, currentUser) {
  try {
    const blog = await prisma.blogs.findUnique({ where: { id } });
    if (!blog) {
      return { success: false, message: "Blog not found." };
    }

    await prisma.blogs.delete({ where: { id } });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "DELETE",
      targetType: "blog",
      targetId: id,
      description: `Blog deleted: ${blog?.title}`,
    });

    return { success: true, message: "Blog successfully deleted." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not delete blog. Check your connection or contact support.",
    };
  }
}

export async function updateBlog({
  id,
  title,
  content,
  published,
  categoryId,
  currentUser,
}) {
  try {
    const blog = await prisma.blogs.findUnique({ where: { id } });
    if (!blog) {
      return { success: false, message: "Blog not found." };
    }

    await prisma.blogs.update({
      where: { id },
      data: {
        title,
        content,
        published,
        categoryId,
      },
    });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "UPDATE",
      targetType: "blog",
      targetId: id,
      description: `Blog updated: ${title}`,
    });

    return {
      success: true,
      message: "Blog updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not update blog. Check your connection or contact support.",
    };
  }
}
