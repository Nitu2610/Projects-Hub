import { Box, Heading, Stack } from "@chakra-ui/react";
import { useEffect } from "react";

import { useGetCartQuery } from "../api/cartApi";
import { CartItem } from "./CartItem";

interface CartProductsProps {
  setCartTotal?: React.Dispatch<React.SetStateAction<number>>;
  setCanCheckout?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CartProducts = ({
  setCartTotal,
  setCanCheckout,
}: CartProductsProps) => {
  const {
    data,
    isLoading,
    isError,
  } = useGetCartQuery();

  const cart = data?.data;

  const cartTotal =
    cart?.items.reduce((sum, item) => {
      const price =
        item.productId.discountedPrice ??
        item.productId.price;

      return sum + price * item.quantity;
    }, 0) ?? 0;

  const canCheckout =
    !!cart &&
    cart.items.length > 0 &&
    cart.items.every((item) => {
      const product = item.productId;

      return (
        product.active &&
        product.stock > 0 &&
        item.quantity <= product.stock
      );
    });

  useEffect(() => {
    setCartTotal?.(cartTotal);
  }, [cartTotal, setCartTotal]);

  useEffect(() => {
    setCanCheckout?.(canCheckout);
  }, [canCheckout, setCanCheckout]);

  if (isLoading) {
    return <Heading>Loading cart...</Heading>;
  }

  if (isError || !cart) {
    return <Heading>Unable to load cart.</Heading>;
  }

  if (cart.items.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        bg="bg.panel"
        p={{ base: 6, md: 8 }}
        textAlign="center"
      >
        <Heading size="md">
          Your cart is empty.
        </Heading>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Your Cart
      </Heading>

      <Stack gap={6}>
        {cart.items.map((item) => (
          <CartItem
            key={item.productId._id}
            item={item}
          />
        ))}
      </Stack>
    </Box>
  );
};