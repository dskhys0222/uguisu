import type { ItemListProps } from "./types";

export default function ItemList(props: ItemListProps) {
  const { className, items, onSelect } = props;

  const sortedItems = items.sort(
    (a, b) => a.updatedAt.valueOf() - b.updatedAt.valueOf(),
  );

  return (
    <ol className={className}>
      {sortedItems.map((item) => (
        <li
          key={item.key}
          className="curosr-pointer truncate"
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
