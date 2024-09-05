import type { Content } from "@tiptap/react";
import type ItemSummary from "./ItemSummary";

export default interface Item extends ItemSummary {
  content: Content;
}
