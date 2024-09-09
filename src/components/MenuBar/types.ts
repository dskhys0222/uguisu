import type { Editor } from "@tiptap/react";

export interface MenuBarProps {
  editor: Editor | null;
  onCreate?: () => void;
  onRemove?: () => void;
  className?: string;
}
