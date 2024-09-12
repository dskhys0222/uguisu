import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import type { ItemListItemProps } from "./types";

export default function ItemListItem(props: ItemListItemProps) {
  const { itemKey, title, isPinned, onClick, onTogglePinned } = props;

  const [isHovered, setIsHovered] = useState(false);

  const StarIcon = isPinned ? StarSolidIcon : StarOutlineIcon;

  return (
    <li
      className="flex cursor-pointer items-center border-b py-3 pr-2 hover:bg-gray-100"
      onClick={() => {
        onClick?.(itemKey);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick?.(itemKey);
        }
      }}
      onMouseOver={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onFocus={() => {
        setIsHovered(true);
      }}
      onBlur={() => {
        setIsHovered(false);
      }}
    >
      <StarIcon
        className={`mr-2 ml-1 size-4 flex-shrink-0 ${isPinned || isHovered ? "text-gray-400" : "opacity-0"}`}
        onClick={(e) => {
          onTogglePinned?.(itemKey);
          e.stopPropagation();
        }}
      />
      <span
        className={`min-w-0 flex-grow truncate ${title === "" ? "text-gray-400 italic" : ""}`}
      >
        {title || "Untitled"}
      </span>
    </li>
  );
}
