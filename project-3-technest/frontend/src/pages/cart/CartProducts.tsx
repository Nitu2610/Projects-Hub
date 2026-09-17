import { CartItem } from "../../components/cart/CartItem";
import { useGetCartQuery } from "../../redux/api/cartApi";
import { Box, Heading, Stack } from "@chakra-ui/react";

interface CartProductsProps {
  setCartTotal?: React.Dispatch<React.SetStateAction<number>>;
}

export const CartProducts = ({ setCartTotal }: CartProductsProps) => {
  const { data, isLoading, isError } = useGetCartQuery();
  if (isLoading) {
    return <Heading>Loading cart...</Heading>;
  }

  if (isError || !data?.data) {
    return <Heading>Unable to load cart.</Heading>;
  }

  const cart = data.data;

  const cartTotal = cart.items.reduce((sum, item) => {
    const price = item.productId.discountedPrice ?? item.productId.price;

    return sum + price * item.quantity;
  }, 0);

  // setCartTotal is used to share the price to cart summary.
  if (setCartTotal) {
    setCartTotal(cartTotal);
  }

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
    </Box>
  );
};

