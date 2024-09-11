export interface MenuDropdownProps {
  triggerElement: React.ReactNode;
  contents: {
    [K in keyof ContentTypes]: ContentTypes[K] extends undefined
      ? Omit<Content<K>, "content">
      : Content<K>;
  }[keyof ContentTypes][];
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
