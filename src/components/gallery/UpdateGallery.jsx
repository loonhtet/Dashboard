"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import InputBox from "../ui/InputBox";
import { BlogDropzone } from "../ui/BlogDropzone";
import Combobox from "../ui/ComboBox";
import { updateGallery } from "@/app/gallery/[id]/update-gallery/action";

const UpdateGallery = ({ gallery, currentUser, services = [] }) => {
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

  // Prefill form with gallery data
  useEffect(() => {
    if (gallery) {
      reset({
        title: gallery.title || "",
        service: gallery.serviceId || "",
        description: gallery.description || "",
        image: gallery.image || null,
      });
    }
  }, [gallery, reset]);

  const onSubmit = async (data) => {
    if (!data.image) {
      toast.error("Please upload an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: gallery.id,
        title: data.title,
        serviceId: data.service,
        description: data.description,
        image: data.image,
        currentUser,
      };

      const res = await updateGallery(payload);

      if (res.success) {
        toast.success(res.message);
        reset(payload); // reset form with updated values
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
        <h1 className="text-2xl font-bold">Update Gallery</h1>
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
            onFileSelect={(file) =>
              setValue("image", file, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            defaultFile={gallery?.image}
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
              defaultValue={gallery?.serviceId}
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

export default UpdateGallery;
