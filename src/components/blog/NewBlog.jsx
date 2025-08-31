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
import {
  Bold,
  CaseSensitive,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  RotateCw,
  Upload,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px] p-4 border border-input rounded-md bg-primary-foreground !prose-invert !text-foreground",
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
      <section className="grid grid-cols-1 gap-y-6 pb-12 lg:grid-cols-3 lg:gap-x-6">
        <div className="w-full">
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
          <div className="mb-2 flex w-fit flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => editor?.chain().focus().undo().run()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => editor?.chain().focus().redo().run()}
              className="flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={cn(
                "flex items-center gap-2",
                editor?.isActive("bold")
                  ? "bg-accent text-accent-foreground"
                  : "",
              )}
            >
              <Bold className="h-4 w-4" />
              <span className="sr-only">Bold</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={cn(
                "flex items-center gap-2",
                editor?.isActive("italic")
                  ? "bg-accent text-accent-foreground"
                  : "",
              )}
            >
              <Italic className="h-4 w-4" />
              <span className="sr-only">Italic</span>
            </Button>

            <Select
              value="p"
              onValueChange={(value) => {
                switch (value) {
                  case "h1":
                    editor?.chain().focus().toggleHeading({ level: 1 }).run();
                    break;
                  case "h2":
                    editor?.chain().focus().toggleHeading({ level: 2 }).run();
                    break;
                  case "h3":
                    editor?.chain().focus().toggleHeading({ level: 3 }).run();
                    break;
                  case "p":
                    editor?.chain().focus().setParagraph().run();
                    break;
                  case "blockquote":
                    editor?.chain().focus().toggleBlockquote().run();
                    break;
                  default:
                    break;
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select block type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="p" className="flex items-center gap-2">
                    <CaseSensitive className="h-4 w-4" />
                    <span>Paragraph</span>
                  </SelectItem>
                  <SelectItem value="h1" className="flex items-center gap-2">
                    <Heading1 className="h-4 w-4" />
                    <span>Heading 1</span>
                  </SelectItem>
                  <SelectItem value="h2" className="flex items-center gap-2">
                    <Heading2 className="h-4 w-4" />
                    <span>Heading 2</span>
                  </SelectItem>
                  <SelectItem value="h3" className="flex items-center gap-2">
                    <Heading3 className="h-4 w-4" />
                    <span>Heading 3</span>
                  </SelectItem>

                  <SelectItem
                    value="blockquote"
                    className="flex items-center gap-2"
                  >
                    <Quote className="h-4 w-4" />
                    <span>Quote</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={cn(
                "flex items-center gap-2",
                editor?.isActive("bulletList")
                  ? "bg-accent text-accent-foreground"
                  : "",
              )}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Bullet List</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={cn(
                "flex items-center gap-2",
                editor?.isActive("orderedList")
                  ? "bg-accent text-accent-foreground"
                  : "",
              )}
            >
              <ListOrdered className="h-4 w-4" />
              <span className="sr-only">Numbered List</span>
            </Button>
            <Button variant="outline" asChild>
              <label className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                <span>Image</span>
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
