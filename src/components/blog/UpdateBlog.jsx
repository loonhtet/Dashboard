"use client";

import { useForm } from "react-hook-form";
import { BlogDropzone } from "../ui/BlogDropzone";
import InputBox from "../ui/InputBox";
import { useState, useCallback, useEffect } from "react";
import { Button } from "../ui/button";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";
import ComboBox from "../ui/ComboBox";
import RichTextEditorToolbar from "../ui/RichTextEditorToolbar";
import RichTextEditorContent from "../ui/RichTextEditorContent";
import {
  getAllCategories,
  updateBlog,
} from "@/app/blog/[slug]/update-blog/action";

const UpdateBlog = ({ blog, currentUser }) => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(blog);

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
      category: "",
      thumbnail: null,
      content: "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write..." }),
      Image,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px] p-4 border border-input rounded-md bg-primary-foreground !prose-invert !text-foreground",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || "",
        description: blog.description || "",
        category: blog.categoryId || "",
        thumbnail: blog.thumbnail || null,
        content: blog.content || "",
      });
      editor?.commands.setContent(blog.content || "");
    }
  }, [blog, reset, editor]);

  // Fetch categories on mount
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle inline image uploads in editor
  const handleImageUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          editor?.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      } catch (err) {
        toast.error("Failed to upload image");
      }
    },
    [editor],
  );

  // Submit blog update
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: blog.id,
        thumbnail: data.thumbnail,
        title: data.title,
        description: data.description,
        content: data.content,
        categoryId: data.category,
        currentUser,
      };

      const res = await updateBlog(payload);

      if (res.success) {
        toast.success(res.message);
        reset(payload); // reset form with updated values
        editor?.commands.setContent(payload.content);
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
        <h1 className="text-2xl font-bold">Edit Blog</h1>
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

      <section className="grid grid-cols-1 gap-y-6 pb-12 lg:grid-cols-3 lg:gap-x-6">
        {/* Sidebar with inputs */}
        <div className="w-full">
          <BlogDropzone
            onFileSelect={(file) => {
              setValue("thumbnail", file, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            defaultFile={blog?.thumbnail}
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 grid grid-cols-1 gap-4"
          >
            <input type="hidden" {...register("thumbnail")} />

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

            <ComboBox
              label="Category"
              name="category"
              placeholder="Select a category"
              data={categories}
              register={register}
              errors={errors}
              validation={{ required: "Category is required" }}
              setValue={setValue}
              defaultValue={blog?.categoryId}
            />
          </form>
        </div>

        {/* Rich text editor */}
        <div className="col-span-2">
          <RichTextEditorToolbar
            editor={editor}
            handleImageUpload={handleImageUpload}
          />
          <RichTextEditorContent editor={editor} />
        </div>
      </section>
    </>
  );
};

export default UpdateBlog;
