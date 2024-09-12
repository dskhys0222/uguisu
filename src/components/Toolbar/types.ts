import type { Editor } from "@tiptap/react";

export interface ToolbarProps {
  editor: Editor | null;
  onCreate?: () => void;
  onRemove?: () => void;
  className?: string;
}
