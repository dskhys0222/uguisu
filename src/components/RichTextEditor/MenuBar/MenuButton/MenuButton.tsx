import type { MenuButtonProps } from "./types";

export default function MenuButton(props: MenuButtonProps) {
  const { children, onClick } = props;

  return (
    <button
      type="button"
      className="h-full w-10 hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
