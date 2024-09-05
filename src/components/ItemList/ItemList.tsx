import type { ItemListProps } from "./types";

export default function ItemList(props: ItemListProps) {
  const { className, items, onSelect } = props;

  const sortedItems = items.sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
  );

  return (
    <ol className={`${className}`}>
      {sortedItems.map((item) => (
        <li
          key={item.key}
          className="cursor-pointer truncate border-b p-3 hover:bg-gray-100"
          onClick={() => {
            onSelect?.(item.key);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSelect?.(item.key);
            }
          }}
        >
          {item.title}
        </li>
      ))}
    </ol>
  );
}
