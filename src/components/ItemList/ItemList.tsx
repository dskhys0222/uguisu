import type { ItemListProps } from "./types";

export default function ItemList(props: ItemListProps) {
  const { className, items, onSelect } = props;

  return (
    <ol className={`${className} h-full overflow-auto`}>
      {items.map((item) => (
        <li
          key={item.key}
          className={`cursor-pointer truncate border-b p-3 hover:bg-gray-100 ${item.title === "" ? "text-gray-400 italic" : ""}`}
          onClick={() => {
            onSelect?.(item.key);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSelect?.(item.key);
            }
          }}
        >
          {item.title || "Untitled"}
        </li>
      ))}
    </ol>
  );
}
