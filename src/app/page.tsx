"use client";

import ItemList from "@/components/ItemList/ItemList";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import ToolbarButton from "@/components/RichTextEditor/Toolbar/ToolbarButton/ToolbarButton";
import type { ItemSummary } from "@/types";
import {
  addPin,
  loadAllSummary,
  moveToTrash,
  removePin,
} from "@/utils/indexedDb/indexedDb";
import { generateUuid } from "@/utils/uuid";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Root } from "@radix-ui/react-toolbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<ItemSummary[]>([]);
  const [isOpenList, setIsOpenList] = useState<boolean>(false);
  const [selectedItemKey, setSelectedItemKey] = useState<string>(generateUuid);

  useEffect(() => {
    onInit();
  }, []);

  const reloadItems = async (): Promise<ItemSummary[]> => {
    const items = await loadAllSummary();
    const sortedItems = items.sort(
      (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
    );
    const pinnedItems = sortedItems.filter((item) => item.isPinned);
    const unpinnedItems = sortedItems.filter((item) => !item.isPinned);
    setItems([...pinnedItems, ...unpinnedItems]);
    return [...pinnedItems, ...unpinnedItems];
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

  const onSelect = (key: string) => {
    setSelectedItemKey(key);
    closeList();
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

  const togglePin = async (key: string) => {
    const isPinned = items.find((item) => item.key === key)?.isPinned;
    if (isPinned) {
      await removePin(key);
    } else {
      await addPin(key);
    }
    await reloadItems();
  };

  const toggleList = () => {
    setIsOpenList(!isOpenList);
  };

  const closeList = () => {
    setIsOpenList(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="relative flex flex-grow overflow-x-auto">
        <nav
          className={`h-full w-96 flex-shrink-0 border-r-2 sm:block ${isOpenList ? "absolute z-20 bg-white" : "hidden"}`}
        >
          <ItemList
            items={items}
            onSelect={onSelect}
            onTogglePinned={togglePin}
          />
        </nav>
        <main className="h-full flex-grow">
          <RichTextEditor
            itemKey={selectedItemKey}
            onChange={reloadItems}
            onCreate={onCreate}
            onRemove={onRemove}
          />
        </main>
        <div
          className={`h-full w-full ${isOpenList ? "absolute bg-gray-500 opacity-50" : "hidden"}`}
          onClick={closeList}
          onKeyDown={closeList}
        />
      </div>
      <footer>
        <Root className="flex h-12 justify-between border-t-2 sm:hidden">
          <ToolbarButton onClick={toggleList}>
            <Bars3Icon className="size-6 text-gray-600" />
          </ToolbarButton>
        </Root>
      </footer>
    </div>
  );
}
