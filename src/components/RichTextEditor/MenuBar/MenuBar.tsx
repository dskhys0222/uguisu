import MenuButton from "./MenuButton/MenuButton";
import type { MenuBarProps } from "./types";

export default function MenuBar(props: MenuBarProps) {
  const { editor, className } = props;

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleStrike = () => {
    editor?.chain().focus().toggleStrike().run();
  };

  return (
    <div className={`flex items-center border-b-2 ${className}`}>
      <MenuButton onClick={toggleBold}>
        <strong>B</strong>
      </MenuButton>
      <MenuButton onClick={toggleItalic}>
        <em>I</em>
      </MenuButton>
      <MenuButton onClick={toggleStrike}>
        <s>S</s>
      </MenuButton>
    </div>
  );
}
