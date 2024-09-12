import { assertNever } from "@/utils/asssertion";
import {
  Content,
  Item,
  Portal,
  Root,
  Separator,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@radix-ui/react-toolbar";
import type { ToolbarDropdownProps } from "./types";

export default function ToolbarDropdown(props: ToolbarDropdownProps) {
  const { triggerElement, contents } = props;
  const indexedContents = contents.map((content, index) => ({
    ...content,
    key: index,
  }));

  return (
    <Root>
      <Button asChild={true}>
        <Trigger className="flex h-full min-w-10 items-center justify-center px-2 hover:bg-gray-100">
          {triggerElement}
        </Trigger>
      </Button>
      <Portal>
        <Content className="rounded border bg-white p-2">
          {indexedContents.map((x) => {
            switch (x.type) {
              case "item":
                return (
                  <Item
                    key={x.key}
                    className="cursor-default rounded px-3 py-1 text-gray-700 text-sm hover:bg-gray-100"
                    onClick={x.content.onClick}
                  >
                    {x.content.labelElement}
                  </Item>
                );
              case "separator":
                return (
                  <Separator key={x.key} className="my-1 h-[1px] bg-gray-200" />
                );
              default:
                assertNever(x);
            }
          })}
        </Content>
      </Portal>
    </Root>
  );
}
