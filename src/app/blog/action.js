"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";
import slugify from "slugify";
import { Messages } from "@/lib/message";

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
      include: {
        category: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      success: true,
      message: Messages.action.fetch.success("Blogs"),
      data: blogs,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      message: Messages.action.fetch.error("Blogs"),
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

    return { success: true, message: Messages.action.delete.success("Blog") };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.delete.error("Blog"),
    };
  }
}

export async function updateBlogStatus(id, published) {
  try {
    const updated = await prisma.blogs.update({
      where: { id },
      data: { published },
    });

    return {
      success: true,
      message: Messages.action.update.success("Blog Status"),
      data: updated,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.update.error("Blog Status"),
    };
  }
}
