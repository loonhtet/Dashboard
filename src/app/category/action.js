"use server";

import { prisma } from "@/lib/prisma";
import { addAuditLog } from "../action";
import slugify from "slugify";

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
      message: "Category created successfully.",
      data: newCategory,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not create category. Check your connection or contact support.",
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

    return { success: true, message: "Category updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not update category. Check your connection or contact support.",
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

    return { success: true, message: "Category deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Could not delete category. Check your connection or contact support.",
    };
  }
}
