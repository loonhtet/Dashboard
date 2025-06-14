"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import InputBox from "../ui/InputBox";
import { loginUser } from "@/app/login/action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await loginUser(data);

    if (response.success) {
      toast.success(response.message);
      router.push("/");
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  return (
    <main>
      <div className="grid h-[95vh] place-content-center">
        <div>
          <h1 className="mb-6 text-2xl font-bold md:text-3xl">
            Welcome to Dashboard
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="w-full max-w-sm">
              <CardContent>
                <div className="flex flex-col gap-6">
                  <InputBox
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    errors={errors}
                    validation={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email format",
                      },
                    }}
                  />
                  <InputBox
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    errors={errors}
                    validation={{
                      required: "Password is required",
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
      <footer className="bg-card grid h-[5vh] place-content-center">
        <p className="text-sm">Copyright</p>
      </footer>
    </main>
  );
};

export default LoginForm;
