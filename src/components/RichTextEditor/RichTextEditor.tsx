"use client";

import { loadItem, saveItem } from "@/utils/indexedDb";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import MenuBar from "./MenuBar/MenuBar";
import styles from "./styles.module.css";
import type { RichTextEditorProps } from "./types";

const load = async (editor: Editor, key: string) => {
  const content = await loadItem(key);
  editor
    .chain()
    .focus()
    .setContent(content ?? "")
    .run();
};

export default function RichTextEditor(props: RichTextEditorProps) {
  const { itemKey, onChange } = props;

  const editor = useEditor({
    extensions: [StarterKit],
    autofocus: true,
    onCreate: async ({ editor }) => {
      await load(editor, itemKey);
    },
    onUpdate: async ({ editor }) => {
      await saveItem(itemKey, editor.getJSON());
      onChange?.();
    },
  });

  useEffect(() => {
    if (editor == null) {
      return;
    }

    load(editor, itemKey);
  }, [editor, itemKey]);

  return (
    <div className={`${styles.container} h-full`}>
      <MenuBar className="h-8" editor={editor} />
      <EditorContent
        className="h-[calc(100%-2rem)] overflow-y-auto p-8 [scrollbar-gutter:stable_both-edges] hover:cursor-text [&>[contenteditable=true]:focus-visible]:outline-none"
        editor={editor}
        onClick={() => editor?.commands.focus()}
      />
    </div>
  );
}
