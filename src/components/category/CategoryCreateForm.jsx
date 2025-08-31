"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import InputBox from "../ui/InputBox";
import { toast } from "sonner";
import { createCategory } from "@/app/category/action"; // <-- new create action

const CategoryCreateForm = ({
  title,
  description,
  action,
  currentUser,
  setOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name,
        currentUser,
      };

      const res = await createCategory(payload);

      if (res.success) {
        toast.success(res.message);
        reset();
        action();
        setOpen(false);
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="text-right">
          <InputBox
            label="Category Name"
            name="name"
            type="text"
            register={register}
            errors={errors}
            validation={{ required: "Name is required" }}
          />

          <div className="mt-4 space-x-2">
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogHeader>
    </DialogContent>
  );
};

export default CategoryCreateForm;
