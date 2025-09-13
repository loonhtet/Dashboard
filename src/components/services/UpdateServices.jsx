"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import InputBox from "../ui/InputBox";
import { BlogDropzone } from "../ui/BlogDropzone";
import { updateService } from "@/app/services/[id]/update-services/action";

const UpdateServices = ({ service, currentUser = [] }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageValue = watch("image");

  useEffect(() => {
    if (service) {
      reset({
        title: service.title || "",
        description: service.description || "",
        image: service.image_url || null,
      });

      setValue("image", service.image_url || null);
      setValue("service", service.serviceId || "");
    }
  }, [service, reset, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: service.id,
        title: data.title,
        description: data.description,
        image: data.image,
        currentUser,
      };

      const res = await updateService(payload);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">Update Services</h1>
        <div className="space-x-2">
          <Button
            variant="default"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-y-6 pb-12 lg:gap-x-6">
        <div className="w-full">
          <BlogDropzone
            key={imageValue || "empty"}
            onFileSelect={(file) =>
              setValue("image", file, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            defaultFile={imageValue ?? null}
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 grid grid-cols-1 gap-4"
          >
            <input type="hidden" {...register("image")} />

            <InputBox
              label="Title"
              name="title"
              type="text"
              register={register}
              errors={errors}
              validation={{ required: "Title is required" }}
            />

            <InputBox
              label="Description"
              name="description"
              type="text"
              register={register}
              errors={errors}
              validation={{ required: "Description is required" }}
            />
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateServices;
