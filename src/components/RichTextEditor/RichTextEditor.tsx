"use client";

import { load, save } from "@/utils/repository";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";

const RichTextEditor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [StarterKit],
    autofocus: true,
    onCreate: ({ editor }) => {
      load(editor);
    },
    onUpdate: ({ editor }) => {
      save(editor);
    },
  });

  const focus = () => {
    ref.current
      ?.querySelector<HTMLDivElement>("[contenteditable=true]")
      ?.focus();
  };

  return (
    <EditorContent
      className="h-full [&>[contenteditable=true]:focus-visible]:outline-none"
      editor={editor}
      ref={ref}
      onClick={focus}
    />
  );
};

export default RichTextEditor;
