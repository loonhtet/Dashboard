"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ToastNotifier() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "success") toast.success("Admin deleted successfully");
    else if (status === "error") toast.error("Failed to delete admin");
  }, [status]);

  return null;
}
