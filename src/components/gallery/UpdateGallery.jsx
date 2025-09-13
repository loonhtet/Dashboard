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
    watch,
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
  const imageValue = watch("image");
  const serviceValue = watch("service");

  useEffect(() => {
    if (gallery) {
      reset({
        title: gallery.title || "",
        service: gallery.serviceId || "",
        description: gallery.description || "",
        image: gallery.image_url || null,
      });

      setValue("image", gallery.image_url || null);
      setValue("service", gallery.serviceId || "");
    }
  }, [gallery, reset, setValue]);

  const onSubmit = async (data) => {
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

        reset({
          title: "",
          service: "",
          description: "",
          image: null,
        });

        setValue("image", null);
        setValue("service", "");
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

            <Combobox
              key={serviceValue || "empty"}
              label="Service"
              name="service"
              placeholder="Select a service"
              data={services}
              register={register}
              errors={errors}
              validation={{ required: "Service is required" }}
              setValue={setValue}
              defaultValue={serviceValue ?? ""}
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
