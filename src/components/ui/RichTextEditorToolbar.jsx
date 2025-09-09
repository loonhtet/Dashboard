"use client";

import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  RotateCcw,
  RotateCw,
  List,
  ListOrdered,
  UploadCloud,
  CaseSensitive,
  Heading1,
  Heading2,
  Heading3,
  Quote,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const RichTextEditorToolbar = ({ editor, handleImageUpload }) => {
  if (!editor) return null;

  return (
    <div className="mb-2 flex w-fit flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().undo().run()}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Undo</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().redo().run()}
        className="flex items-center gap-2"
      >
        <RotateCw className="h-4 w-4" />
        <span className="sr-only">Redo</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "flex items-center gap-2",
          editor.isActive("bold") ? "bg-accent text-accent-foreground" : "",
        )}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "flex items-center gap-2",
          editor.isActive("italic") ? "bg-accent text-accent-foreground" : "",
        )}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Select
        value="p"
        onValueChange={(value) => {
          switch (value) {
            case "h1":
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              break;
            case "h2":
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              break;
            case "h3":
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              break;
            case "p":
              editor.chain().focus().setParagraph().run();
              break;
            case "blockquote":
              editor.chain().focus().toggleBlockquote().run();
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
              <CaseSensitive className="h-4 w-4" /> Paragraph
            </SelectItem>
            <SelectItem value="h1" className="flex items-center gap-2">
              <Heading1 className="h-4 w-4" /> Heading 1
            </SelectItem>
            <SelectItem value="h2" className="flex items-center gap-2">
              <Heading2 className="h-4 w-4" /> Heading 2
            </SelectItem>
            <SelectItem value="h3" className="flex items-center gap-2">
              <Heading3 className="h-4 w-4" /> Heading 3
            </SelectItem>
            <SelectItem value="blockquote" className="flex items-center gap-2">
              <Quote className="h-4 w-4" /> Quote
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Lists */}
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "flex items-center gap-2",
          editor.isActive("bulletList")
            ? "bg-accent text-accent-foreground"
            : "",
        )}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "flex items-center gap-2",
          editor.isActive("orderedList")
            ? "bg-accent text-accent-foreground"
            : "",
        )}
      >
        <ListOrdered className="h-4 w-4" />
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
  );
};

export default RichTextEditorToolbar;
