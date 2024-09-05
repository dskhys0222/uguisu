import MenuButton from "./MenuButton/MenuButton";
import type { MenuBarProps } from "./types";

export default function MenuBar(props: MenuBarProps) {
  const { editor, className } = props;

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  return (
    <div
      className={`flex items-center border-2 [&>button]:border-r-2 ${className}`}
    >
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
      <MenuButton onClick={toggleBold}>B</MenuButton>
    </div>
  );
}
