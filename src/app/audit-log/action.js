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
