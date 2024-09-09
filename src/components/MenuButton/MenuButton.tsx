import type { MenuButtonProps } from "./types";

export default function MenuButton(props: MenuButtonProps) {
  const { children, onClick } = props;

  return (
    <button
      type="button"
      className="flex h-full min-w-10 items-center justify-center px-2 hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
