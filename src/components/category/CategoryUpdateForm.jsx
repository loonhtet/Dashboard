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
} from "../ui/dialog";
import InputBox from "../ui/InputBox";
import { toast } from "sonner";
import { updateCategory } from "@/app/category/action";

const CategoryUpdateForm = ({
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
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = {
        id: datas.id,
        newName: data.name,
        oldName: datas.name,
        currentUser: currentUser,
      };

      const res = await updateCategory(payload);

      if (res.success) {
        toast.success(res.message);
        reset();
        action();
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          <InputBox
            label="Category Name"
            name="name"
            type="text"
            register={register}
            errors={errors}
            validation={{ required: "Name is required" }}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={action}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </DialogHeader>
    </DialogContent>
  );
};

export default CategoryUpdateForm;
