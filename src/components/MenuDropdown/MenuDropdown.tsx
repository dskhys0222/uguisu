import {
  Content,
  Item,
  Portal,
  Root,
  Separator,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import type { MenuDropdownProps } from "./types";

export default function MenuDropdown(props: MenuDropdownProps) {
  const { triggerElement, contents } = props;
  const indexedContents = contents.map((content, index) => ({
    ...content,
    key: index,
  }));

  return (
    <Root>
      <Trigger className="flex h-full min-w-10 items-center justify-center px-2 hover:bg-gray-100">
        {triggerElement}
      </Trigger>
      <Portal>
        <Content className="rounded border bg-white p-2">
          {indexedContents.map(({ key, type, content }) =>
            type === "item" ? (
              <Item
                key={key}
                className="cursor-default rounded px-3 py-1 text-gray-700 text-sm hover:bg-gray-100"
                onClick={content.onClick}
              >
                {content.labelElement}
              </Item>
            ) : (
              <Separator key={key} className="my-1 h-[1px] bg-gray-200" />
            ),
          )}
        </Content>
      </Portal>
    </Root>
  );
}
