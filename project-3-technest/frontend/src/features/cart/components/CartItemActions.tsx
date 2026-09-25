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
  const [updateCartItem, { isLoading: isUpdating }] =
    useUpdateCartItemMutation();

  const [deleteCartItem, { isLoading: isDeleting }] =
    useDeleteCartItemMutation();

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
    <HStack mt={4}>
      <Button onClick={handleDecrease} disabled={isLoading}>
        −
      </Button>

      <Text minW="30px" textAlign="center">
        {quantity}
      </Text>

      <Button
        onClick={handleIncrease}
        disabled={!active || quantity >= stock || isLoading}
      >
        +
      </Button>

      <Button onClick={handleRemove} disabled={isLoading}>
        Remove
      </Button>
      <Text>
        {" "}
        Product Total Amount : ₹ {productTotalPrice.toLocaleString(
          "en-IN",
        )}{" "}
        /-{" "}
      </Text>
    </HStack>
  );
};
