"use client";

import { useForm, Controller } from "react-hook-form"; // Import Controller
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import InputBox from "../ui/InputBox";
import { createAdmin, sendOtp, verifyOtp } from "@/app/admin/new-admin/action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const NewAdmin = ({ currentUser }) => {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">New Admin</h1>
      <NewAdminForm currentUser={currentUser} />
    </>
  );
};

export default NewAdmin;

export const NewAdminForm = ({ currentUser }) => {
  const {
    register: registerAdmin,
    handleSubmit: handleAdminSubmit,
    formState: { errors: adminErrors },
    reset: resetAdminForm,
  } = useForm();

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [adminFormData, setAdminFormData] = useState(null);

  const onAdminSubmit = async (data) => {
    setIsSending(true);
    setSubmittedEmail(data.email);
    setAdminFormData(data);
    try {
      const response = await sendOtp(data.email);
      if (response.success) {
        toast.success(response.message);
        setOpen(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const onVerifySubmit = async (data) => {
    setIsVerifying(true);
    try {
      const response = await verifyOtp(submittedEmail, data.otp);

      if (response.success) {
        await createAdmin({
          name: adminFormData.name,
          email: adminFormData.email,
          password: adminFormData.password,
          email_verified: response.success,
          currentUser: currentUser,
        });
        setOpen(false);
        resetOtpForm();
        resetAdminForm();
        router.push("/admin");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleAdminSubmit(onAdminSubmit)}
        className="grid grid-cols-2 gap-4 space-y-4"
      >
        <InputBox
          label="Name"
          name="name"
          type="text"
          register={registerAdmin}
          errors={adminErrors}
          validation={{ required: "Name is required" }}
        />
        <InputBox
          label="Email"
          name="email"
          type="email"
          register={registerAdmin}
          errors={adminErrors}
          validation={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          }}
        />
        <div className="col-span-2">
          <InputBox
            label="Password"
            name="password"
            type="password"
            register={registerAdmin}
            errors={adminErrors}
            validation={{ required: "Password is required" }}
          />
        </div>
        <div className="col-span-2 ms-auto">
          <Button type="submit" disabled={isSending}>
            {isSending && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </div>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold">{submittedEmail}</span>.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleOtpSubmit(onVerifySubmit)}
            className="space-y-4 pt-4"
          >
            <Controller
              control={otpControl}
              name="otp"
              rules={{
                required: "Please enter the OTP.",
                minLength: {
                  value: 6,
                  message: "OTP must be 6 digits long.",
                },
              }}
              render={({ field }) => (
                <div className="flex flex-col items-center">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-14" />
                      <InputOTPSlot index={1} className="h-14 w-14" />
                      <InputOTPSlot index={2} className="h-14 w-14" />
                      <InputOTPSlot index={3} className="h-14 w-14" />
                      <InputOTPSlot index={4} className="h-14 w-14" />
                      <InputOTPSlot index={5} className="h-14 w-14" />
                    </InputOTPGroup>
                  </InputOTP>
                  {otpErrors.otp && (
                    <p className="text-destructive mt-2 text-sm font-medium">
                      {otpErrors.otp.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying && <Loader2 className="animate-spin" />}
              Verify Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
