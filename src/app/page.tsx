"use client";

import ItemList from "@/components/ItemList/ItemList";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import type { ItemSummary } from "@/types";
import { loadAllSummary, moveToTrash } from "@/utils/indexedDb";
import { generateUuid } from "@/utils/uuid";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<ItemSummary[]>([]);
  const [selectedItemKey, setSelectedItemKey] = useState<string>(generateUuid);

  useEffect(() => {
    onInit();
  }, []);

  const reloadItems = async (): Promise<ItemSummary[]> => {
    const items = await loadAllSummary();
    const sortedItems = items.sort(
      (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
    );
    setItems(sortedItems);
    return sortedItems;
  };

  const createNewItem = () => {
    const key = generateUuid();
    setSelectedItemKey(key);
  };

  const onInit = async () => {
    const items = await reloadItems();
    if (items.length > 0) {
      setSelectedItemKey(items[0].key);
    }
  };

  const onCreate = () => {
    createNewItem();
  };

  const onRemove = async () => {
    await moveToTrash(selectedItemKey);
    const items = await reloadItems();
    if (items.length > 0) {
      setSelectedItemKey(items[0].key);
    } else {
      createNewItem();
    }
  };

  return (
    <div className="flex h-screen">
      <nav className="w-60 flex-shrink-0 border-r-2">
        <ItemList items={items} onSelect={setSelectedItemKey} />
      </nav>
      <main className="h-full max-w-[calc(100%-15rem)] flex-grow">
        <RichTextEditor
          itemKey={selectedItemKey}
          onChange={reloadItems}
          onCreate={onCreate}
          onRemove={onRemove}
        />
      </main>
    </div>
  );
}
