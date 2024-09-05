import type { Item, ItemSummary } from "@/types";
import type { JSONContent } from "@tiptap/react";
import { getTitle } from "./jsonContent";

const dbName = "content_db";
const dbVersion = 2;
const activeStoreName = "content_store";
const trashStoreName = "trash_store";

const open = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (e) => {
      const db = request.result;
      if (e.oldVersion < 1) {
        db.createObjectStore(activeStoreName, { keyPath: "key" });
      }
      if (e.oldVersion < 2) {
        db.createObjectStore(trashStoreName, { keyPath: "key" });
      }
    };
  });
};

// TODO: itemの型TをstoreNameから決定できるようにする
// TODO: put, get, getAll, removeを一つの関数にまとめる (できれば)
const put = async <T>(
  transaction: IDBTransaction,
  storeName: string,
  item: T,
): Promise<void> => {
  const store = transaction.objectStore(storeName);
  const request = store.put(item);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

const get = async <T>(
  transaction: IDBTransaction,
  storeName: string,
  key: string,
): Promise<T | undefined> => {
  const store = transaction.objectStore(storeName);
  const request = store.get(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

const getAll = async <T>(
  transaction: IDBTransaction,
  storeName: string,
): Promise<T[] | undefined> => {
  const store = transaction.objectStore(storeName);
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

const remove = async (
  transaction: IDBTransaction,
  storeName: string,
  key: string,
): Promise<void> => {
  const store = transaction.objectStore(storeName);
  const request = store.delete(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const loadAllSummary = async (): Promise<ItemSummary[]> => {
  const db = await open();
  const transaction = db.transaction(activeStoreName, "readonly");

  try {
    const items = await getAll<Item>(transaction, activeStoreName);
    const summaries = items?.map(({ content, ...summary }) => summary) ?? [];
    return summaries;
  } catch {
    transaction.abort();
    return [];
  } finally {
    db.close();
  }
};

export const loadItem = async (
  key: string,
): Promise<JSONContent | undefined> => {
  const db = await open();
  const transaction = db.transaction(activeStoreName, "readonly");

  try {
    const record = await get<JSONContent>(transaction, activeStoreName, key);
    return record?.content;
  } catch {
    transaction.abort();
  } finally {
    db.close();
  }
};

export const saveItem = async (
  key: string,
  content: JSONContent,
): Promise<void> => {
  const db = await open();
  const transaction = db.transaction(activeStoreName, "readwrite");
  const item: Item = {
    key,
    content,
    title: getTitle(content),
    updatedAt: new Date(),
  };

  try {
    await put(transaction, activeStoreName, item);
  } catch {
    transaction.abort();
  } finally {
    db.close();
  }
};

export const moveToTrash = async (key: string): Promise<void> => {
  const db = await open();
  const transaction = db.transaction(
    [activeStoreName, trashStoreName],
    "readwrite",
  );

  try {
    const item = await get<Item>(transaction, activeStoreName, key);
    await remove(transaction, activeStoreName, key);
    await put(transaction, trashStoreName, item);
  } catch {
    transaction.abort();
  } finally {
    db.close();
  }
};
