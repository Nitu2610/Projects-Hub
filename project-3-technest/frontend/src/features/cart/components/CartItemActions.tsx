import { Button, HStack, Text } from "@chakra-ui/react";

import {
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "../api/cartApi";

interface CartItemActionsProps {
  productId: string;
  quantity: number;
  stock: number;
  active: boolean;
  price: number;
}

export const CartItemActions = ({
  productId,
  quantity,
  stock,
  active,
  price,
}: CartItemActionsProps) => {
  const [
    updateCartItem,
    { isLoading: isUpdating },
  ] = useUpdateCartItemMutation();

  const [
    deleteCartItem,
    { isLoading: isDeleting },
  ] = useDeleteCartItemMutation();

  const productTotalPrice = price * quantity;

  const handleDecrease = async () => {
    if (quantity <= 1) {
      await deleteCartItem(productId);
      return;
    }

    await updateCartItem({
      productId,
      quantity: quantity - 1,
    });
  };

  const handleIncrease = async () => {
    if (!active || quantity >= stock) {
      return;
    }

    await updateCartItem({
      productId,
      quantity: quantity + 1,
    });
  };

  const handleRemove = async () => {
    await deleteCartItem(productId);
  };

  const isLoading = isUpdating || isDeleting;

  return (
    <HStack
      mt={4}
      gap={3}
      flexWrap="wrap"
    >
      <HStack
        borderWidth="1px"
        borderColor="border"
        borderRadius="lg"
        overflow="hidden"
        bg="bg.panel"
      >
        <Button
          borderRadius="0"
          variant="ghost"
          minW="44px"
          onClick={handleDecrease}
          disabled={isLoading}
          aria-label="Decrease quantity"
        >
          −
        </Button>

        <Text
          minW="40px"
          textAlign="center"
          fontWeight="600"
        >
          {quantity}
        </Text>

        <Button
          borderRadius="0"
          variant="ghost"
          minW="44px"
          onClick={handleIncrease}
          disabled={
            !active ||
            quantity >= stock ||
            isLoading
          }
          aria-label="Increase quantity"
        >
          +
        </Button>
      </HStack>

      <Button
        variant="outline"
        onClick={handleRemove}
        disabled={isLoading}
      >
        {isDeleting ? "Removing..." : "Remove"}
      </Button>

      <Text
        fontWeight="600"
        ml={{ base: 0, sm: "auto" }}
      >
        ₹{productTotalPrice.toLocaleString("en-IN")}
      </Text>
    </HStack>
  );
};