import type { ItemSummary } from "@/types";
import type { JSONContent } from "@tiptap/react";
import { getTitle } from "../jsonContent";
import type {
  ActiveStoreRecord,
  ExportData,
  PinStoreRecord,
  TrashStoreRecord,
} from "./types";

const dbName = "content_db";
const dbVersion = 3;
const activeStoreName = "content_store";
const trashStoreName = "trash_store";
const pinStoreName = "pin_store";

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
      if (e.oldVersion < 3) {
        db.createObjectStore(pinStoreName, { keyPath: "key" });
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
): Promise<T[]> => {
  const store = transaction.objectStore(storeName);
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result ?? []);
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
  const transaction = db.transaction(
    [activeStoreName, pinStoreName],
    "readonly",
  );

  try {
    const items = await getAll<ActiveStoreRecord>(transaction, activeStoreName);
    const pinned = await getAll<PinStoreRecord>(transaction, pinStoreName);
    const pinnedKeys = pinned.map((item) => item.key);
    const summaries = items.map(({ content, ...summary }) => ({
      ...summary,
      isPinned: pinnedKeys.includes(summary.key),
    }));
    return summaries;
  } catch {
    transaction.abort();
    return [];
  } finally {
    db.close();
  }
};

export const loadContent = async (
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

export const saveContent = async (
  key: string,
  content: JSONContent,
): Promise<void> => {
  const db = await open();
  const transaction = db.transaction(activeStoreName, "readwrite");
  const item: ActiveStoreRecord = {
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
    const item = await get<ActiveStoreRecord>(
      transaction,
      activeStoreName,
      key,
    );
    if (!item) {
      throw new Error("Item not found");
    }
    await remove(transaction, activeStoreName, key);
    await put<TrashStoreRecord>(transaction, trashStoreName, item);
  } catch {
    transaction.abort();
  } finally {
    db.close();
  }
};

export const addPin = async (key: string): Promise<void> => {
  const db = await open();
  const transaction = db.transaction(pinStoreName, "readwrite");

  try {
    await put<PinStoreRecord>(transaction, pinStoreName, { key });
  } catch (e) {
    console.error(e);
    transaction.abort();
  } finally {
    db.close();
  }
};

export const removePin = async (key: string): Promise<void> => {
  const db = await open();
  const transaction = db.transaction(pinStoreName, "readwrite");

  try {
    await remove(transaction, pinStoreName, key);
  } catch {
    transaction.abort();
  } finally {
    db.close();
  }
};

export const exportData = async () => {
  const db = await open();
  const transaction = db.transaction(
    [activeStoreName, pinStoreName],
    "readonly",
  );

  try {
    const items = await getAll<ActiveStoreRecord>(transaction, activeStoreName);
    const pinned = await getAll<PinStoreRecord>(transaction, pinStoreName);
    const exportData: ExportData = {
      active: items,
      pin: pinned,
    };
    const blob = new Blob([JSON.stringify(exportData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uguisu_export.json";
    a.click();
  } catch {
    transaction.abort();
  } finally {
    db.close();
  }
};

export const importData = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text) as ExportData;
  const db = await open();
  const transaction = db.transaction(
    [activeStoreName, pinStoreName],
    "readwrite",
  );

  try {
    for (const item of data.active) {
      await put(transaction, activeStoreName, item);
    }
    for (const item of data.pin) {
      await put(transaction, pinStoreName, item);
    }
  } catch {
    transaction.abort();
    throw new Error("Failed to import items");
  } finally {
    db.close();
  }
};
