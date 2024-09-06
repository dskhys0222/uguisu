import { Extension } from "@tiptap/core";
import { CellSelection } from "@tiptap/pm/tables";
import { type Editor, findParentNodeClosestToPos } from "@tiptap/react";

const isCellSelection = (value: unknown): value is CellSelection => {
  return value instanceof CellSelection;
};

const handleDelete = (editor: Editor) => {
  console.debug("onDelete", editor.state);

  // セル選択中でない場合は何もしない
  const { selection } = editor.state;
  if (!isCellSelection(selection)) {
    return false;
  }

  const tableNode = findParentNodeClosestToPos(
    selection.$anchorCell,
    (node) => {
      return node.type.name === "table";
    },
  )?.node;
  if (tableNode == null) {
    return false;
  }

  // const rows = tableNode.childCount;
  // const cols = tableNode.firstChild?.childCount ?? 0;

  return false;
};

const handleBackspace = (editor: Editor) => {
  console.debug("onBackspace", editor);
  return false;
};

const handleEnter = (editor: Editor) => {
  console.debug("onEnter", editor);
  const { state, view } = editor;
  const { selection, schema, tr } = state;
  const { $anchor, empty } = selection;

  const tableNode = findParentNodeClosestToPos(
    $anchor,
    (node) => node.type.name === "table",
  );
  if (!tableNode) {
    return false;
  }

  if (!empty) {
    editor.commands.goToNextCell();
    return true;
  }

  const tableEndPos = tableNode.pos + tableNode.node.nodeSize - 4; // table, tableRow, tableCell, paragraphの4ノードあるので-4
  if ($anchor.pos === tableEndPos) {
    const paragraph = schema.nodes.paragraph.create();
    const insertPos = tableNode.pos + tableNode.node.nodeSize;
    tr.insert(insertPos, paragraph);
    view.dispatch(tr);
    editor.commands.focus(insertPos + 1);
    return true;
  }

  const tableStartPos = tableNode.pos + 4;
  if ($anchor.pos === tableStartPos) {
    const paragraph = schema.nodes.paragraph.create();
    tr.insert(tableNode.pos, paragraph);
    view.dispatch(tr);
    return true;
  }

  editor.commands.goToNextCell();
  return true;
};

export const TableKeymap = Extension.create({
  name: "tableKeymap",

  addKeyboardShortcuts() {
    return {
      // biome-ignore lint/style/useNamingConvention: 外部ライブラリの仕様に従うため
      Delete: ({ editor }) => {
        if (editor.state.schema.nodes.table == null) {
          return false;
        }

        return handleDelete(editor);
      },
      // biome-ignore lint/style/useNamingConvention: 外部ライブラリの仕様に従うため
      Backspace: ({ editor }) => {
        if (editor.state.schema.nodes.table == null) {
          return false;
        }

        return handleBackspace(editor);
      },
      // biome-ignore lint/style/useNamingConvention: 外部ライブラリの仕様に従うため
      Enter: ({ editor }) => {
        if (editor.state.schema.nodes.table == null) {
          return false;
        }

        return handleEnter(editor);
      },
    };
  },
});
