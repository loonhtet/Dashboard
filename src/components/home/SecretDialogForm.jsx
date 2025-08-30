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
import {
  CloudIcon,
  DatabaseIcon,
  ExternalLink,
  GlobeIcon,
  HardDriveIcon,
  Loader2,
  MailIcon,
  ServerIcon,
} from "lucide-react";
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
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
      setShowSuccessDialog(true);
      reset();
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
        <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto p-4 sm:max-w-[50vw] sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold sm:text-2xl">
              Sensitive Credentials
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm sm:text-base">
              These credentials are critical for your application’s
              configuration. Handle them with care and do not share them with
              anyone.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Database Info */}
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                  <DatabaseIcon className="h-5 w-5 text-blue-500" />
                  Database Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Database Name
                  </p>
                  <p className="text-muted-foreground text-sm">Neon</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Type</p>
                  <p className="text-muted-foreground text-sm">PostgreSQL</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Password
                  </p>
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    npg_iOEdKvAj58lI
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-foreground text-sm font-medium">URL</p>
                  <a
                    href="https://console.neon.tech/app/projects/fragrant-wave-16583118"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to console
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* SMTP Info */}
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                  <MailIcon className="h-5 w-5 text-green-500" />
                  SMTP Nodemailer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    SMTP Host
                  </p>
                  <p className="text-muted-foreground text-sm">
                    smtp.example.com
                  </p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Port</p>
                  <p className="text-muted-foreground text-sm">465</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">User</p>
                  <p className="text-muted-foreground text-sm">
                    your_email@example.com
                  </p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Password
                  </p>
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    your_email_password_or_app_password
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* VPS Info */}
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                  <ServerIcon className="h-5 w-5 text-purple-500" />
                  VPS Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                <div>
                  <p className="text-foreground text-sm font-medium">Host</p>
                  <p className="text-muted-foreground text-sm">
                    vps.example.com
                  </p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    IP Address
                  </p>
                  <p className="text-muted-foreground text-sm">192.168.1.100</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Username
                  </p>
                  <p className="text-muted-foreground text-sm">admin</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Password
                  </p>
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    vps_secure_password_123
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Deploy Info (Coolify) */}
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                  <CloudIcon className="h-5 w-5 text-teal-500" />
                  Deploy Info (Coolify)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Coolify Instance
                  </p>
                  <p className="text-muted-foreground text-sm">
                    coolify.example.com
                  </p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Project Name
                  </p>
                  <p className="text-muted-foreground text-sm">my-app</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    API Token
                  </p>
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    coolify_api_token_abc123
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-foreground text-sm font-medium">
                    Dashboard URL
                  </p>
                  <a
                    href="https://app.coolify.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to Coolify Dashboard
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* S3 AWS Info */}
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                  <HardDriveIcon className="h-5 w-5 text-orange-500" />
                  S3 AWS Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Bucket Name
                  </p>
                  <p className="text-muted-foreground text-sm">my-app-bucket</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Region</p>
                  <p className="text-muted-foreground text-sm">us-east-1</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Access Key ID
                  </p>
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    AKIAIOSFODNN7EXAMPLE
                  </p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Secret Access Key
                  </p>
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Domain Namecheap Info */}
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                  <GlobeIcon className="h-5 w-5 text-indigo-500" />
                  Domain Namecheap Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Domain Name
                  </p>
                  <p className="text-muted-foreground text-sm">example.com</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Username
                  </p>
                  <p className="text-muted-foreground text-sm">
                    namecheap_user
                  </p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">API Key</p>
                  <p className="text-muted-foreground font-mono text-sm break-all">
                    namecheap_api_key_456xyz
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-foreground text-sm font-medium">
                    Dashboard URL
                  </p>
                  <a
                    href="https://www.namecheap.com/myaccount/login/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to Namecheap Dashboard
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      )}
    </>
  );
};

export default SecretDialogForm;
