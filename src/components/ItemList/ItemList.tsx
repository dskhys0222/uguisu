import ItemListItem from "./ItemListItem/ItemListItem";
import type { ItemListProps } from "./types";

export default function ItemList(props: ItemListProps) {
  const { className, items, onSelect, onTogglePinned } = props;

  return (
    <ol className={`${className} h-full overflow-auto`}>
      {items.map((item) => (
        <ItemListItem
          key={item.key}
          itemKey={item.key}
          title={item.title}
          isPinned={item.isPinned}
          onClick={() => {
            onSelect?.(item.key);
          }}
          onTogglePinned={(key) => {
            onTogglePinned?.(key);
          }}
        />
      ))}
    </ol>
  );
}
