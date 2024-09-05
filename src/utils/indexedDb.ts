import type { Item, ItemSummary } from "@/types";
import type { JSONContent } from "@tiptap/react";
import { getTitle } from "./jsonContent";

const dbName = "content_db";
const dbVersion = 1;
const storeName = "content_store";

const open = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore(storeName, { keyPath: "key" });
    };
  });
};

export const loadAllSummary = async (): Promise<ItemSummary[]> => {
  const db = await open();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const items: Item[] | undefined = request.result as Item[] | undefined;
      const summaries: ItemSummary[] =
        items?.map(({ content, ...summary }) => summary) ?? [];
      db.close();
      resolve(summaries);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const loadItem = async (
  key: string,
): Promise<JSONContent | undefined> => {
  const db = await open();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  const request = store.get(key);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const content = request.result?.content;
      db.close();
      resolve(content);
    };

    request.onerror = () => {
      db.close();
      reject();
    };
  });
};

export const saveItem = async (
  key: string,
  content: JSONContent,
): Promise<void> => {
  const db = await open();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  const item: Item = {
    key,
    content,
    title: getTitle(content),
    updatedAt: new Date(),
  };
  const request = store.put(item);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject();
    };
  });
};
