"use client";

import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import InputBox from "../ui/InputBox";
import { BlogDropzone } from "../ui/BlogDropzone";
import { createService } from "@/app/services/new-services/action";

const NewServices = ({ currentUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
        };
        reader.readAsDataURL(file);
      } catch (err) {
        toast.error("Failed to upload image");
      }
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);

    try {
      const payload = {
        title: data.title,
        description: data.description,
        image: data.image,
        currentUser,
      };

      const res = await createService(payload);

      if (res.success) {
        toast.success(res.message);
        reset();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">New Service</h1>
        <div className="space-x-2">
          <Button variant="secondary" disabled={isSubmitting}>
            Draft
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            Publish
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-y-6 pb-12 lg:gap-x-6">
        <div className="w-full">
          <BlogDropzone
            onFileSelect={(file) =>
              setValue("image", file, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
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

export default NewServices;
