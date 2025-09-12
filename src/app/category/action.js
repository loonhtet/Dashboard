"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";
import slugify from "slugify";
import { Messages } from "@/lib/message";

export async function getAllCategories(search = "") {
  try {
    const categories = await prisma.categories.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      success: true,
      data: categories,
      message: Messages.action.fetch.success("Category"),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.fetch.error("Category"),
    };
  }
}

export async function createCategory({ name, currentUser }) {
  try {
    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "en",
    });

    const newCategory = await prisma.categories.create({
      data: {
        name,
        slug,
      },
    });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "CREATE",
      targetType: "category",
      targetId: newCategory.id,
      description: `Category created: ${name}`,
    });

    return {
      success: true,
      message: Messages.action.create.success("Category"),
      data: newCategory,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.create.error("Category"),
    };
  }
}

export async function updateCategory({ id, oldName, newName, currentUser }) {
  try {
    const category = await prisma.categories.findUnique({ where: { id } });
    if (!category) {
      return { success: false, message: "Category not found." };
    }

    const slug = slugify(newName, { lower: true, strict: true, locale: "en" });

    await prisma.categories.update({
      where: { id },
      data: { name: newName, slug },
    });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "UPDATE",
      targetType: "category",
      targetId: id,
      description: `Category updated: ${oldName} to ${newName}`,
    });

    return {
      success: true,
      message: Messages.action.update.success("Category"),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.update.error("Category"),
    };
  }
}

export async function deleteCategory(id, currentUser) {
  try {
    const category = await prisma.categories.findUnique({ where: { id } });
    if (!category) {
      return { success: false, message: "Category not found." };
    }

    await prisma.categories.delete({ where: { id } });

    await addAuditLog({
      user_name: currentUser.name || null,
      user_email: currentUser.email || null,
      actionType: "DELETE",
      targetType: "category",
      targetId: id,
      description: `Category deleted: ${category.name}`,
    });

    return {
      success: true,
      message: Messages.action.delete.success("Category"),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.delete.error("Category"),
    };
  }
}
