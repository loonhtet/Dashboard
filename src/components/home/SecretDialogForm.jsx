"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import InputBox from "../ui/InputBox";
import { DatabaseIcon, ExternalLink, Loader2, MailIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { checkCurrentPassword } from "@/app/action";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const SecretDialogForm = ({
  title,
  description,
  action,
  value,
  text,
  variant,
}) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await checkCurrentPassword(data.password);

    setLoading(false);

    if (response.success) {
      toast.success(response.message);
      setShowSuccessDialog(true); // Open the success dialog
      reset(); // Optional: clear form
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <input type="hidden" name="id" value={value} />

            <InputBox
              label="Password"
              name="password"
              type="password"
              register={register}
              errors={errors}
              validation={{ required: "Password is required" }}
            />

            <div className="mt-4 w-full">
              <Button
                type="submit"
                className="w-full"
                variant={variant}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 animate-spin" />}
                {text}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>

      {showSuccessDialog && (
        <DialogContent className="sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Sensitive Credentials
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              These credentials are critical for your application’s
              configuration. Handle them with care and do not share them with
              anyone.
            </DialogDescription>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
                  <DatabaseIcon className="h-5 w-5 text-blue-500" />
                  Database Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">Database Name</p>
                    <p className="text-muted-foreground">Neon</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Type</p>
                    <p className="text-muted-foreground">PostgreSQL</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Password</p>
                    <p className="text-muted-foreground font-mono">
                      npg_iOEdKvAj58lI
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">URL</p>
                    <a
                      href="https://console.neon.tech/app/projects/fragrant-wave-16583118"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink />
                        Go to console
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* SMTP Info */}
              <div className="rounded-xl border p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
                  <MailIcon className="h-5 w-5 text-green-500" />
                  SMTP Nodemailer
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">SMTP Host</p>
                    <p className="text-muted-foreground">smtp.example.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Port</p>
                    <p className="text-muted-foreground">465</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">User</p>
                    <p className="text-muted-foreground">
                      your_email@example.com
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Password</p>
                    <p className="text-muted-foreground font-mono">
                      your_email_password_or_app_password
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      )}
    </>
  );
};

export default SecretDialogForm;
