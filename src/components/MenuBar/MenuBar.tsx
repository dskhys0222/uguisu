import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import MenuButton from "../MenuButton/MenuButton";
import type { MenuBarProps } from "./types";

export default function MenuBar(props: MenuBarProps) {
  const { editor, onRemove, className } = props;

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleStrike = () => {
    editor?.chain().focus().toggleStrike().run();
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
      </div>
      <div className="flex">
        <MenuButton onClick={remove}>
          <TrashIcon className="size-6 text-gray-600" />
        </MenuButton>
      </div>
    </div>
  );
}
