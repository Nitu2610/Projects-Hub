import { Button, Dialog, Portal, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type {
  AdminCancellationReason,
  OrderStatus,
} from "../../../../types/order.types";
import { useCancelAdminOrderMutation } from "../../api/adminOrderApi";

interface AdminCancelOrderButtonProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const adminCancellationReasons: {
  label: string;
  value: AdminCancellationReason;
}[] = [
  {
    label: "Customer Request",
    value: "CUSTOMER_REQUEST",
  },
  {
    label: "Out of Stock",
    value: "OUT_OF_STOCK",
  },
  {
    label: "Payment Failed",
    value: "PAYMENT_FAILED",
  },
  {
    label: "Operational Issue",
    value: "OPERATIONAL_ISSUE",
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

  const canCancel = currentStatus === "PLACED" || currentStatus === "CONFIRMED";

  if (!canCancel) return null;

  const handleCancel = async (
    adminCancellationReasons: AdminCancellationReason,
  ) => {
    try {
      await cancelAdminOrder({
        orderId,
        adminCancellationReasons,
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
                {adminCancellationReasons.map((reason) => (
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
