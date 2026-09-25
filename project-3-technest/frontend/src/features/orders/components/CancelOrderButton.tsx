import {
  Button,
  Dialog,
  Portal,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

import { useCancelOrderMutation } from "../api/orderApi";
import type {
  CancellationReason,
  OrderStatus,
} from "../../../types/order.types";

interface CancelOrderButtonProps {
  orderId: string;
  orderStatus: OrderStatus;
}

export const CancelOrderButton = ({
  orderId,
  orderStatus,
}: CancelOrderButtonProps) => {
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const [cancellationReason, setCancellationReason] = useState<
    CancellationReason | ""
  >("");

  const canCancelOrder =
    orderStatus === "PLACED" || orderStatus === "CONFIRMED";

  const cancellationReasons: {
    value: CancellationReason;
    label: string;
  }[] = [
    {
      value: "CHANGED_MIND",
      label: "Changed my mind",
    },
    {
      value: "ORDERED_BY_MISTAKE",
      label: "Ordered by mistake",
    },
    {
      value: "FOUND_BETTER_PRICE",
      label: "Found a better price",
    },
    {
      value: "DELIVERY_DELAY",
      label: "Delivery delay",
    },
    {
      value: "OTHER",
      label: "Other",
    },
  ];

  const handleCancelOrder = async () => {
    if (!cancellationReason) {
      return;
    }

    try {
      await cancelOrder({
        orderId,
        cancellationReason,
      }).unwrap();

      setIsCancelDialogOpen(false);
      setCancellationReason("");
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsCancelDialogOpen(open);

    if (!open) {
      setCancellationReason("");
    }
  };

  if (!canCancelOrder) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsCancelDialogOpen(true)}
        disabled={isCancelling}
      >
        Cancel Order
      </Button>

      <Dialog.Root
        open={isCancelDialogOpen}
        onOpenChange={(details) => handleDialogChange(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Cancel Order</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Text mb={4}>
                  Please select a reason for cancelling your order.
                </Text>

                <RadioGroup.Root
                  value={cancellationReason}
                  onValueChange={(details) =>
                    setCancellationReason(details.value as CancellationReason)
                  }
                >
                  <Stack gap={3}>
                    {cancellationReasons.map((reason) => (
                      <RadioGroup.Item key={reason.value} value={reason.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>
                          {reason.label}
                        </RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </Stack>
                </RadioGroup.Root>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={() => handleDialogChange(false)}
                  disabled={isCancelling}
                >
                  Keep Order
                </Button>

                <Button
                  onClick={handleCancelOrder}
                  disabled={!cancellationReason}
                  loading={isCancelling}
                >
                  Confirm Cancellation
                </Button>
              </Dialog.Footer>

              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
