import type { Content } from "@tiptap/react";

export interface ActiveStoreRecord {
  key: string;
  title: string;
  updatedAt: Date;
  content: Content;
}

export interface TrashStoreRecord extends ActiveStoreRecord {}

export interface PinStoreRecord {
  key: string;
}

export interface ExportData {
  active: ActiveStoreRecord[];
  pin: PinStoreRecord[];
}
