"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import InputBox from "../ui/InputBox";
import { BlogDropzone } from "../ui/BlogDropzone";
import Combobox from "../ui/ComboBox";
import { createGallery } from "@/app/gallery/new-gallery/action";

const NewGallery = ({ currentUser, services = [] }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      service: "",
      description: "",
      image: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

const onSubmit = async (data) => {
  if (!data.image) {
    toast.error("Please upload an image.");
    return;
  }

  setIsSubmitting(true);
  try {
    const payload = {
      title: data.title,
      serviceId: data.service,
      description: data.description,
      image: data.image, 
      currentUser,
    };

    const res = await createGallery(payload);
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
        <h1 className="text-2xl font-bold">New Gallery</h1>
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

            <Combobox
              label="Service"
              name="service"
              placeholder="Select a service"
              data={services}
              register={register}
              errors={errors}
              validation={{ required: "Service is required" }}
              setValue={setValue}
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

export default NewGallery;
