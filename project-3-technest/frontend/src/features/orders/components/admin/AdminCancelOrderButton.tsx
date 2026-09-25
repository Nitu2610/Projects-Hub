import { Button, Dialog, Portal, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";


import type {
  CancellationReason,
  OrderStatus,
} from "../../../../types/order.types";
import { useCancelAdminOrderMutation } from "../../api/adminOrderApi";

interface AdminCancelOrderButtonProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const cancellationReasons: {
  label: string;
  value: CancellationReason;
}[] = [
  {
    label: "Changed mind",
    value: "CHANGED_MIND",
  },
  {
    label: "Ordered by mistake",
    value: "ORDERED_BY_MISTAKE",
  },
  {
    label: "Found better price",
    value: "FOUND_BETTER_PRICE",
  },
  {
    label: "Delivery delay",
    value: "DELIVERY_DELAY",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];

export const AdminCancelOrderButton = ({
  orderId,
  currentStatus,
}: AdminCancelOrderButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [cancelAdminOrder, { isLoading }] = useCancelAdminOrderMutation();

  const canCancel =
    currentStatus === "PLACED" ||
    currentStatus === "CONFIRMED" ||
    currentStatus === "SHIPPED";

  if (!canCancel) {
    return null;
  }

  const handleCancel = async (cancellationReason: CancellationReason) => {
    try {
      await cancelAdminOrder({
        orderId,
        cancellationReason,
      }).unwrap();

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline" colorPalette="red">
          Cancel Order
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Cancel Order</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text mb={4}>Select a reason for cancelling this order.</Text>

              <Stack gap={3}>
                {cancellationReasons.map((reason) => (
                  <Button
                    key={reason.value}
                    variant="outline"
                    justifyContent="flex-start"
                    loading={isLoading}
                    onClick={() => handleCancel(reason.value)}
                  >
                    {reason.label}
                  </Button>
                ))}
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="ghost" disabled={isLoading}>
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
