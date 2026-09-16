import { Box, Heading, Image, Text } from "@chakra-ui/react";
import type { CartItem as CartItemType } from "../../redux/api/cartApi";
import { CartItemActions } from "./CartItemActions";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const product = item.productId;

  const unavailable = !product.active;
  const insufficientStock = item.quantity > product.stock;

  return (
    <Box borderWidth="1px" p={4}>
      <Image
        src={product.image}
        alt={product.title}
        w="150px"
        h="150px"
        objectFit="contain"
      />

      <Heading size="md" mt={3}>
        {product.title}
      </Heading>

      <Text mt={2}>₹{product.discountedPrice ?? product.price}</Text>

      <Text mt={2}>Quantity: {item.quantity}</Text>

      {unavailable && (
        <Text mt={2}>This product is currently unavailable.</Text>
      )}

      {!unavailable && insufficientStock && (
        <Text mt={2}>
          Only {product.stock} units are currently available. Please reduce the
          quantity.
        </Text>
      )}
      <CartItemActions
        productId={product._id}
        quantity={item.quantity}
        stock={product.stock}
        active={product.active}
      />
    </Box>
  );
};
