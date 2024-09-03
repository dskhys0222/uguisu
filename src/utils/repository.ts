import type { Editor } from "@tiptap/react";

export const load = (editor: Editor) => {
  const content = JSON.parse(localStorage.getItem("content") ?? '""');
  editor.commands.setContent(content);
};

export const save = (editor: Editor) => {
  const content = JSON.stringify(editor.getJSON());
  localStorage.setItem("content", content);
};
