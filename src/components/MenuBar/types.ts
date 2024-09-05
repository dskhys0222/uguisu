import type { Editor } from "@tiptap/react";

export interface MenuBarProps {
  editor: Editor | null;
  onRemove?: () => void;
  className?: string;
}
