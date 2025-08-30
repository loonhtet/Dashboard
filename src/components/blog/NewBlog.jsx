"use client";

import { useForm } from "react-hook-form";
import { BlogDropzone } from "../ui/BlogDropzone";
import InputBox from "../ui/InputBox";
import { useState, useCallback } from "react";
import { updateCategory } from "@/app/category/action";
import { Button } from "../ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const NewBlog = ({ currentUser }) => {
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
      content: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 border border-input rounded-md bg-background",
      },
    },
    immediatelyRender: false,
  });

  const handleImageUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          // Simulating BlogDropzone upload logic
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = {
        title: data.title,
        description: data.description,
        content: data.content,
        currentUser: currentUser,
      };

      const res = await updateCategory(payload);

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
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-bold">New Blog</h1>
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
      <section className="grid grid-cols-1 gap-4 pb-12 lg:grid-cols-3">
        <div>
          <BlogDropzone />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 grid grid-cols-1 gap-4"
          >
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

        <div className="col-span-2">
          <label className="text-foreground text-sm font-medium">
            Blog Content
          </label>
          <div className="mb-2 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? "bg-accent" : ""}
            >
              Bold
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive("italic") ? "bg-accent" : ""}
            >
              Italic
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor?.isActive("heading", { level: 1 }) ? "bg-accent" : ""
              }
            >
              H1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor?.isActive("heading", { level: 2 }) ? "bg-accent" : ""
              }
            >
              H2
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive("bulletList") ? "bg-accent" : ""}
            >
              List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive("orderedList") ? "bg-accent" : ""}
            >
              Numbered
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = window.prompt("Enter the URL");
                if (url) {
                  editor?.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={editor?.isActive("link") ? "bg-accent" : ""}
            >
              Link
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label>
                <Upload className="mr-2 h-4 w-4" />
                Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </Button>
          </div>
          <EditorContent editor={editor} />
        </div>
      </section>
    </>
  );
};

export default NewBlog;
