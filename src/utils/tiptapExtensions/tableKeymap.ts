import { Extension } from "@tiptap/core";
import { type Editor, findParentNodeClosestToPos } from "@tiptap/react";

const handleEnter = (editor: Editor) => {
  const {
    state: {
      selection: { $anchor, empty },
      schema,
      tr,
    },
    view,
  } = editor;

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

  const tableEndPos = tableNode.pos + tableNode.node.nodeSize - $anchor.depth;
  if ($anchor.pos === tableEndPos) {
    const paragraph = schema.nodes.paragraph.create();
    const insertPos = tableNode.pos + tableNode.node.nodeSize;
    tr.insert(insertPos, paragraph);
    view.dispatch(tr);
    editor.commands.focus(insertPos + 1);
    return true;
  }

  const tableStartPos = tableNode.pos + $anchor.depth;
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

  addKeyboardShortcuts: () => {
    return {
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
