import type { ItemSummary } from "@/types";

export interface ItemListProps {
  className?: string;
  items: ItemSummary[];
  onSelect?: (key: string) => void;
  onTogglePinned?: (key: string) => void;
}
