"use client";

import { useForm } from "react-hook-form";
import { BlogDropzone } from "../ui/BlogDropzone";
import InputBox from "../ui/InputBox";
import { useState, useCallback } from "react";
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
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createGallery } from "@/app/gallery/action";

const NewGallery = ({ currentUser }) => {
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
      content: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your gallery description...",
      }),
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: "",
    onUpdate: ({ editor }) => setValue("content", editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px] p-4 border border-input rounded-md bg-primary-foreground !prose-invert !text-foreground",
      },
    },
    immediatelyRender: false,
  });

  const handleImageUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target.result;
          setImageUrl(base64);
          editor?.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    },
    [editor],
  );

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error("Please upload an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        serviceId: data.service,
        content: data.content,
        image_url: imageUrl,
        currentUser,
      };

      const res = await createGallery(payload);
      if (res.success) {
        toast.success(res.message);
        reset();
        editor?.commands.clearContent();
        setImageUrl("");
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

      <section className="grid grid-cols-1 gap-y-6 pb-12 lg:grid-cols-3 lg:gap-x-6">
        <div className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 grid grid-cols-1 gap-4"
          >
                        <div>
              <label className="mb-2 block">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-2 h-32 w-32 rounded object-cover"
                />
              )}
            </div>
            <InputBox
              label="Title"
              name="title"
              type="text"
              register={register}
              errors={errors}
              validation={{ required: "Title is required" }}
            />
            <InputBox
              label="Service ID"
              name="service"
              type="text"
              register={register}
              errors={errors}
              validation={{ required: "Service is required" }}
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
          </div>

          <EditorContent editor={editor} />
        </div>
      </section>
    </>
  );
};

export default NewGallery;
