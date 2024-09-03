import type { Editor } from "@tiptap/react";

const dbName = "content_db";
const dbVersion = 1;
const storeName = "content_store";

const tmpKey = "default";

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

export const load = async (editor: Editor) => {
  const db = await open();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  const request = store.get(tmpKey);

  request.onsuccess = () => {
    const { content } = request.result;
    editor.commands.setContent(content);
    db.close();
  };

  request.onerror = () => {
    db.close();
  };
};

export const save = async (editor: Editor) => {
  const content = editor.getJSON();
  const db = await open();

  try {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.put({ key: tmpKey, content });
  } catch (e) {
    console.error("Failed to save content", e);
    throw e;
  } finally {
    db.close();
  }
};
