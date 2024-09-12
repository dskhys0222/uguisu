import { exportData } from "@/utils/indexedDb/indexedDb";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  ArchiveBoxXMarkIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BoldIcon,
  CommandLineIcon,
  DocumentPlusIcon,
  ItalicIcon,
  StrikethroughIcon,
} from "@heroicons/react/24/outline";
import { TableCellsIcon } from "@heroicons/react/24/solid";
import { Root } from "@radix-ui/react-toolbar";
import { findParentNodeClosestToPos } from "@tiptap/react";
import { useRouter } from "next/navigation";
import ToolbarButton from "./ToolbarButton/ToolbarButton";
import ToolbarDropdown from "./ToolbarDropdown/ToolbarDropdown";
import type { ToolbarProps } from "./types";

export default function Toolbar(props: ToolbarProps) {
  const { editor, onCreate, onRemove, className } = props;

  const router = useRouter();

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
    <Root className={`flex justify-between border-b-2 ${className}`}>
      <div className="flex">
        <ToolbarButton onClick={toggleBold}>
          <BoldIcon className="size-6 text-gray-600" />
        </ToolbarButton>
        <ToolbarButton onClick={toggleItalic}>
          <ItalicIcon className="size-6 text-gray-600" />
        </ToolbarButton>
        <ToolbarButton onClick={toggleStrike}>
          <StrikethroughIcon className="size-6 text-gray-600" />
        </ToolbarButton>
        <ToolbarDropdown
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
        <ToolbarButton onClick={test}>
          <CommandLineIcon className="size-6 text-gray-600" />
        </ToolbarButton>
        <ToolbarButton onClick={exportData}>
          <ArrowDownTrayIcon className="size-6 text-gray-600" />
        </ToolbarButton>
        <ToolbarButton onClick={() => router.push("/import")}>
          <ArrowUpTrayIcon className="size-6 text-gray-600" />
        </ToolbarButton>
        <ToolbarButton onClick={create}>
          <DocumentPlusIcon className="size-6 text-gray-600" />
        </ToolbarButton>
        <ToolbarButton onClick={remove}>
          <ArchiveBoxXMarkIcon className="size-6 text-gray-600" />
        </ToolbarButton>
      </div>
    </Root>
  );
}
