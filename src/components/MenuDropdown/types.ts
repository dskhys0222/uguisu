export interface MenuDropdownProps {
  triggerElement: React.ReactNode;
  contents: (Content<"item"> | Content<"separator">)[];
}

export interface ContentTypes {
  item: Item;
  separator: undefined;
}

export interface Content<T extends keyof ContentTypes> {
  type: T;
  content: ContentTypes[T];
}

export interface Item {
  labelElement: React.ReactNode;
  onClick: () => void;
}
