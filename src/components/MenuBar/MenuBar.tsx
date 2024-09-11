import { ChevronDownIcon } from "@heroicons/react/16/solid";
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
import MenuDropdown from "../MenuDropdown/MenuDropdown";
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

  const isFocusedTable = () => {
    return (
      editor != null &&
      !!findParentNodeClosestToPos(
        editor?.state.selection.$anchor,
        (node) => node.type.name === "table",
      )
    );
  };

  const isFocusedHeaderRow = () => {
    return (
      editor != null &&
      !!findParentNodeClosestToPos(
        editor?.state.selection.$anchor,
        (node) => node.type.name === "tableHeader",
      )
    );
  };

  const insertTable = () => {
    if (isFocusedTable()) {
      return;
    }

    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
      .run();
  };

  const deleteTable = () => {
    if (!isFocusedTable()) {
      return;
    }

    editor?.chain().focus().deleteTable().run();
  };

  const addRowBefore = () => {
    if (!isFocusedTable() || isFocusedHeaderRow()) {
      return;
    }

    editor?.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    if (!isFocusedTable()) {
      return;
    }

    editor?.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    if (!isFocusedTable() || isFocusedHeaderRow()) {
      return;
    }

    editor?.chain().focus().deleteRow().run();
  };

  const addColumnBefore = () => {
    if (!isFocusedTable()) {
      return;
    }

    editor?.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    if (!isFocusedTable()) {
      return;
    }

    editor?.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    if (!isFocusedTable()) {
      return;
    }

    editor?.chain().focus().deleteColumn().run();
  };

  const test = () => {
    console.debug("test", editor?.state.selection);
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
        <MenuDropdown
          triggerElement={
            <>
              <TableCellsIcon className="size-6 text-gray-600" />
              <ChevronDownIcon className="size-4 text-gray-600" />
            </>
          }
          contents={[
            {
              type: "item",
              content: { labelElement: "Insert Table", onClick: insertTable },
            },
            { type: "separator" },
            {
              type: "item",
              content: {
                labelElement: "Add Column Before",
                onClick: addColumnBefore,
              },
            },
            {
              type: "item",
              content: {
                labelElement: "Add Column After",
                onClick: addColumnAfter,
              },
            },
            {
              type: "item",
              content: {
                labelElement: "Add Row Before",
                onClick: addRowBefore,
              },
            },
            {
              type: "item",
              content: { labelElement: "Add Row After", onClick: addRowAfter },
            },
            { type: "separator" },
            {
              type: "item",
              content: { labelElement: "Delete Column", onClick: deleteColumn },
            },
            {
              type: "item",
              content: { labelElement: "Delete Row", onClick: deleteRow },
            },
            { type: "separator" },
            {
              type: "item",
              content: { labelElement: "Delete Table", onClick: deleteTable },
            },
          ]}
        />
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
