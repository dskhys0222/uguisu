import type { JSONContent } from "@tiptap/react";

export const getText = (content: JSONContent | undefined): string => {
  return (
    content?.content
      ?.map((node) => {
        if (node.type === "text") {
          return node.text;
        }
        return "";
      })
      .join("") ?? ""
  );
};

export const getTitle = (content: JSONContent): string => {
  return getText(content.content?.at(0));
};
