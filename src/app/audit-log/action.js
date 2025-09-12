"use server";

import { Messages } from "@/lib/message";
import { prisma } from "@/lib/prisma";

export async function getAuditLogs({ date, actionType }) {
  try {
    const filters = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filters.timestamp = {
        gte: start,
        lte: end,
      };
    }

    if (actionType) {
      filters.action_type = actionType;
    }

    const logs = await prisma.audit_logs.findMany({
      where: filters,
      orderBy: {
        timestamp: "desc",
      },
    });

    return {
      data: logs,
      success: true,
      message: Messages.action.fetch.success("Audit Log"),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: Messages.action.fetch.error("Audit Log"),
    };
  }
}

export async function deleteOldAuditLogs() {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 3);

    const result = await prisma.audit_logs.deleteMany({
      where: {
        timestamp: {
          lt: oneMonthAgo,
        },
      },
    });

    return { success: true, data: result.count };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
