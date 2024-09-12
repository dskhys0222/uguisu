import { Button } from "@radix-ui/react-toolbar";
import type { ToolbarButtonProps } from "./types";

export default function ToolbarButton(props: ToolbarButtonProps) {
  const { children, onClick } = props;

  return (
    <Button
      type="button"
      className="flex h-full min-w-10 items-center justify-center px-2 hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
