import type { FloatingButtonProps } from "./types";

export default function FloatingButton(props: FloatingButtonProps) {
  const { children, onClick } = props;

  return (
    <button
      type="button"
      className="fixed right-4 bottom-4 h-9 w-9 rounded-full bg-gray-400 text-3xl text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
