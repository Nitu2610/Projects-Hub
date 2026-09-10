import {
  Tooltip as ChakraTooltip,
  Portal,
} from "@chakra-ui/react";
import {
  forwardRef,
  type ComponentProps,
  type RefObject,
} from "react";

type TooltipProps = ComponentProps<typeof ChakraTooltip.Root> & {
  showArrow?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  portalled?: boolean;
  content?: React.ReactNode;
  contentProps?: ComponentProps<typeof ChakraTooltip.Content>;
portalRef?: RefObject<HTMLElement | null>;
};

export const Tooltip = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  const {
    showArrow,
    children,
    disabled,
    portalled = true,
    content,
    contentProps,
    portalRef,
    ...rest
  } = props;

  if (disabled) return children;

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>
        {children}
      </ChakraTooltip.Trigger>

      <Portal
        disabled={!portalled}
        container={portalRef}
      >
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content
            ref={ref}
            {...contentProps}
          >
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}

            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
});