"use client";

import React from "react";
import { EditorContent } from "@tiptap/react";

export default function RichTextEditorContent({ editor }) {
  if (!editor) return null;

  return (
    <EditorContent
      editor={editor}
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl border-input !prose-invert !text-foreground mx-auto min-h-[300px] rounded-md border focus:outline-none"
    />
  );
}
