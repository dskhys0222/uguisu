export interface ItemListItemProps {
  itemKey: string;
  title: string;
  isPinned: boolean;
  onClick?: (itemKey: string) => void;
  onTogglePinned?: (itemKey: string) => void;
}
