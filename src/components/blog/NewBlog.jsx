"use client";

import { useForm } from "react-hook-form";
import { BlogDropzone } from "../ui/BlogDropzone";
import InputBox from "../ui/InputBox";
import { useState, useCallback, useEffect } from "react";
import { Button } from "../ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

import { toast } from "sonner";
import ComboBox from "../ui/ComboBox";
import RichTextEditorToolbar from "../ui/RichTextEditorToolbar";
import RichTextEditorContent from "../ui/RichTextEditorContent";
import { createBlog, getAllCategories } from "@/app/blog/new-blog/action";
import { Loader2 } from "lucide-react";

const NewBlog = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [categories, setCategories] = useState([]);

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
    },
  });

  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
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

  const fetchCategories = async (search = "") => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file) {
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
      }
    },
    [editor],
  );

  const onSubmit = async (data, isPublished = false) => {
    if (isPublished) {
      setIsSubmittingPublish(true);
    } else {
      setIsSubmittingDraft(true);
    }

    try {
      const payload = {
        thumbnail: data.thumbnail,
        title: data.title,
        description: data.description,
        content: data.content,
        categoryId: data.category,
        currentUser: currentUser,
        published: isPublished,
      };

      console.log(payload);

      const res = await createBlog(payload);

      if (res.success) {
        toast.success(res.message);
        reset();
        editor?.commands.clearContent();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      if (isPublished) {
        setIsSubmittingPublish(false);
      } else {
        setIsSubmittingDraft(false);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">New Blog</h1>
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={handleSubmit((data) => onSubmit(data, false))}
            disabled={isSubmittingDraft || isSubmittingPublish}
          >
            {isSubmittingDraft && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Draft
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit((data) => onSubmit(data, true))}
            disabled={isSubmittingDraft || isSubmittingPublish}
          >
            {isSubmittingPublish && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Publish
          </Button>
        </div>
      </header>
      <section className="grid grid-cols-1 gap-y-6 pb-12 lg:grid-cols-3 lg:gap-x-6">
        <div className="w-full">
          <BlogDropzone
            onFileSelect={(file) => {
              setValue("thumbnail", file, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
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
            />
          </form>
        </div>

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

export default NewBlog;
