import {
  ArchiveBoxXMarkIcon,
  BoldIcon,
  CommandLineIcon,
  DocumentPlusIcon,
  ItalicIcon,
  StrikethroughIcon,
} from "@heroicons/react/24/outline";
import { TableCellsIcon } from "@heroicons/react/24/solid";
import { findParentNodeClosestToPos } from "@tiptap/react";
import MenuButton from "../MenuButton/MenuButton";
import type { MenuBarProps } from "./types";

export default function MenuBar(props: MenuBarProps) {
  const { editor, onCreate, onRemove, className } = props;

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleStrike = () => {
    editor?.chain().focus().toggleStrike().run();
  };

  const insertTable = () => {
    const isFocusedTable =
      editor != null &&
      !!findParentNodeClosestToPos(
        editor?.state.selection.$anchor,
        (node) => node.type.name === "table",
      );

    if (isFocusedTable) {
      return;
    }

    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
      .run();
  };

  const test = () => {
    editor?.chain().focus().createParagraphNear().run();
  };

  const create = () => {
    onCreate?.();
  };

  const remove = () => {
    onRemove?.();
  };

  return (
    <div className={`flex justify-between border-b-2 ${className}`}>
      <div className="flex">
        <MenuButton onClick={toggleBold}>
          <BoldIcon className="size-6 text-gray-600" />
        </MenuButton>
        <MenuButton onClick={toggleItalic}>
          <ItalicIcon className="size-6 text-gray-600" />
        </MenuButton>
        <MenuButton onClick={toggleStrike}>
          <StrikethroughIcon className="size-6 text-gray-600" />
        </MenuButton>
        <MenuButton onClick={insertTable}>
          <TableCellsIcon className="size-6 text-gray-600" />
        </MenuButton>
      </div>
      <div className="flex">
        <MenuButton onClick={test}>
          <CommandLineIcon className="size-6 text-gray-600" />
        </MenuButton>
        <MenuButton onClick={create}>
          <DocumentPlusIcon className="size-6 text-gray-600" />
        </MenuButton>
        <MenuButton onClick={remove}>
          <ArchiveBoxXMarkIcon className="size-6 text-gray-600" />
        </MenuButton>
      </div>
    </div>
  );
}
