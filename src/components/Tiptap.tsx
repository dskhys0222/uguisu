"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";


const Tiptap = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [StarterKit],
    autofocus: true,
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

export default Tiptap;
