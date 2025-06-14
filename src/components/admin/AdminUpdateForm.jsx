import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import InputBox from "../ui/InputBox";
import { sendOtp, verifyOtp } from "@/app/admin/new-admin/action";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { updateAdmin } from "@/app/admin/action";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const AdminUpdateForm = ({
  datas,
  title,
  description,
  action,
  currentUser,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: datas.name,
      email: datas.email,
    },
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm();

  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [adminFormData, setAdminFormData] = useState(null);

  const onAdminSubmit = async (data) => {
    const payload = {
      id: datas.id,
      name: data.name,
      email: data.email,
      email_verified: true,
      currentUser: currentUser,
    };

    setAdminFormData(payload);

    if (data.email === datas.email) {
      try {
        const res = await updateAdmin(payload);
        if (res.success) {
          toast.success(res.message);
          reset();
          action();
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
      return;
    }

    setIsSending(true);
    setSubmittedEmail(data.email);

    try {
      const res = await sendOtp(data.email);
      if (res.success) {
        toast.success(res.message);
        setOpen(true);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const onVerifySubmit = async (data) => {
    setIsVerifying(true);
    try {
      const res = await verifyOtp(submittedEmail, data.otp);
      if (res.success) {
        const finalPayload = { ...adminFormData, email_verified: true };
        const updateRes = await updateAdmin(finalPayload);

        if (updateRes.success) {
          toast.success(updateRes.message);
          reset();
          resetOtpForm();
          setOpen(false);
          action();
        } else {
          toast.error(updateRes.message);
        }
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>

          <form
            onSubmit={handleSubmit(onAdminSubmit)}
            className="grid grid-cols-2 gap-4 space-y-4"
          >
            <InputBox
              label="Name"
              name="name"
              type="text"
              register={register}
              errors={errors}
              validation={{ required: "Name is required" }}
            />
            <InputBox
              label="Email"
              name="email"
              type="email"
              register={register}
              errors={errors}
              validation={{
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              }}
            />
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
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="h-14 w-14"
                            />
                          ))}
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
        </DialogHeader>
      </DialogContent>
    </>
  );
};

export default AdminUpdateForm;
