import { Box, Button, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useGetCartQuery } from "../redux/api/cartApi";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";

export const Cart = () => {
  const { data, isLoading, isError } = useGetCartQuery();

 

  if (isLoading) {
    return <Heading>Loading cart...</Heading>;
  }

  if (isError || !data?.data) {
    return <Heading>Unable to load cart.</Heading>;
  }

  const cart = data.data;

   const total = cart.items.reduce((sum, item) => {
  const price =
    item.productId.discountedPrice ?? item.productId.price;

  return sum + price * item.quantity;
}, 0);

  if (cart.items.length === 0) {
    return (
      <Box maxW="1000px" mx="auto" p={6}>
        <Heading>Your cart is empty.</Heading>
      </Box>
    );
  }

  return (
    <Box maxW="1000px" mx="auto" p={6}>
      <Heading mb={6}>Your Cart</Heading>

      <Stack gap={6}>
        {cart.items.map((item) => (
          <CartItem key={item.productId._id} item={item} />
        ))}
      </Stack>

      <CartSummary total={total} />
      
    </Box>
  );
};
