import { Button, Dialog, Portal, Text } from "@chakra-ui/react";
import { useState } from "react";

import { useDeactivateProductMutation } from "../../api/productApi";

interface DeactivateProductButtonProps {
  productId: string;
  productTitle: string;
}

export const DeactivateProductButton = ({
  productId,
  productTitle,
}: DeactivateProductButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deactivateProduct, { isLoading }] = useDeactivateProductMutation();

  const handleDeactivate = async () => {
    try {
      await deactivateProduct(productId).unwrap();

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to deactivate product:", error);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline" colorPalette="red">
          Deactivate
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Deactivate Product</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text>
                Are you sure you want to deactivate{" "}
                <strong>{productTitle}</strong>?
              </Text>

              <Text mt={2}>
                The product will no longer be available for customers to
                purchase.
              </Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="ghost" disabled={isLoading}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>

              <Button
                colorPalette="red"
                loading={isLoading}
                onClick={handleDeactivate}
              >
                Confirm Deactivate
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
