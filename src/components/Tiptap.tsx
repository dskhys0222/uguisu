"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";

const load = (editor: Editor) => {
  const content = JSON.parse(localStorage.getItem("content") ?? '""');
  editor.commands.setContent(content);
};

const save = (editor: Editor) => {
  const content = JSON.stringify(editor.getJSON());
  localStorage.setItem("content", content);
};

const Tiptap = () => {
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

export default Tiptap;
