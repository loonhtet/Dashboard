"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/login/LoginForm";
import { toast } from "sonner";

const page = () => {
  const params = useSearchParams();
  const sessionExpired = params.get("sessionExpired");

  useEffect(() => {
    if (sessionExpired === "true") {
      toast.error("Your session has expired. Please login again.");
    }
  }, [sessionExpired]);

  return (
    <>
      <LoginForm />
    </>
  );
};

export default page;
