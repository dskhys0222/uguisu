import type { MenuButtonProps } from "./types";

export default function MenuButton(props: MenuButtonProps) {
  const { children, onClick } = props;

  return (
    <button type="button" className="px-2" onClick={onClick}>
      {children}
    </button>
  );
}
