"use client";

import useDebounce from "@/hooks/useDebounce";
import { loadContent, saveContent } from "@/utils/indexedDb/indexedDb";
import { TableKeymap } from "@/utils/tiptapExtensions/tableKeymap";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import ListKeymap from "@tiptap/extension-list-keymap";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import {
  type Editor,
  EditorContent,
  type JSONContent,
  useEditor,
} from "@tiptap/react";
import { common, createLowlight } from "lowlight";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar/Toolbar";
import styles from "./styles.module.scss";
import type { RichTextEditorProps } from "./types";

const grammers = {
  ...common,
  ino: common.arduino,
  cs: common.csharp,
  gql: common.graphql,
  js: common.javascript,
  kt: common.kotlin,
  md: common.markdown,
  m: common.objectivec,
  pl: common.perl,
  py: common.python,
  rb: common.ruby,
  rs: common.rust,
  sh: common.shell,
  ts: common.typescript,
  yml: common.yaml,
};
const lowlight = createLowlight(grammers);

const extensions = [
  Document,
  Paragraph,
  Text,
  Heading,
  BulletList,
  OrderedList,
  ListItem,
  TaskList,
  TaskItem.configure({ nested: true }),
  CodeBlockLowlight.configure({ lowlight }),
  Blockquote,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  HorizontalRule,
  Bold,
  Italic,
  Strike,
  Code,
  ListKeymap,
  History,
  TableKeymap,
];

const load = async (editor: Editor, key: string) => {
  const content = await loadContent(key);
  editor
    .chain()
    .setContent(content ?? "")
    .run();
};

export default function RichTextEditor(props: RichTextEditorProps) {
  const { itemKey, onChange, onCreate, onRemove } = props;

  const [content, setContent] = useState<JSONContent>();
  useDebounce(
    async () => {
      if (content == null) {
        return;
      }

      await saveContent(itemKey, content);
      onChange?.();
    },
    1000,
    [content],
  );

  const editor = useEditor({
    extensions,
    onCreate: async ({ editor }) => {
      await load(editor, itemKey);
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor == null) {
      return;
    }

    load(editor, itemKey);
  }, [editor, itemKey]);

  const onClickEditor: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      editor?.commands.focus(Number.MAX_VALUE);
    }
  };

  return (
    <div className={`${styles.container} h-full`}>
      <Toolbar
        className="h-12"
        editor={editor}
        onCreate={onCreate}
        onRemove={onRemove}
      />
      <EditorContent
        className="h-[calc(100%-3rem)] overflow-y-auto p-8 [scrollbar-gutter:stable_both-edges] hover:cursor-text [&>[contenteditable=true]:focus-visible]:outline-none"
        editor={editor}
        onClick={onClickEditor}
      />
    </div>
  );
}
