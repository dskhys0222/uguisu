"use client";

import { load, save } from "@/utils/indexedDb";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";
import styles from "./styles.module.css";

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
    <div className={`${styles.container} h-full`}>
      <EditorContent
        className="h-full [&>[contenteditable=true]:focus-visible]:outline-none"
        editor={editor}
        ref={ref}
        onClick={focus}
      />
    </div>
  );
};

export default RichTextEditor;
