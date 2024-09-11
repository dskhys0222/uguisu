"use client";

import { importItems } from "@/utils/indexedDb";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ImportPage() {
  const [file, setFile] = useState<File>();
  const router = useRouter();

  const startImport = async () => {
    if (file == null) {
      return;
    }

    try {
      await importItems(file);
      alert("Imported successfully");
    } catch {
      alert("Failed to import");
    }
  };

  return (
    <div className="p-4">
      <h1>Import Page</h1>
      <input
        type="file"
        className="my-2"
        onChange={(e) => {
          const files = e.currentTarget.files;
          if (files != null) {
            setFile(files[0]);
          }
        }}
      />
      <br />
      <button
        type="button"
        className="rounded border bg-gray-100 p-1 enabled:hover:bg-gray-200 disabled:text-gray-400"
        disabled={file == null}
        onClick={startImport}
      >
        start import
      </button>
      <button
        type="button"
        className="ml-2 rounded border bg-gray-100 p-1 hover:bg-gray-200"
        onClick={() => router.back()}
      >
        back
      </button>
    </div>
  );
}
