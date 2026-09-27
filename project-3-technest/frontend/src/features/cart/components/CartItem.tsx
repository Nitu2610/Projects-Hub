import {
  Box,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

import { CartItemActions } from "./CartItemActions";
import { CartItem as CartItemType } from "../../../types/cart.types";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({
  item,
}: CartItemProps) => {
  const product = item.productId;

  const unavailable = !product.active;
  const insufficientStock =
    item.quantity > product.stock;

  const price =
    product.discountedPrice ?? product.price;

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      bg="bg.panel"
      p={{ base: 4, md: 5 }}
    >
      <Stack
        direction={{ base: "column", sm: "row" }}
        gap={5}
      >
        <Box
          width={{ base: "100%", sm: "150px" }}
          height="150px"
          flexShrink={0}
          bg="bg.muted"
          borderRadius="lg"
          overflow="hidden"
        >
          <Image
            src={product.image}
            alt={product.title}
            width="100%"
            height="100%"
            objectFit="contain"
            p={3}
          />
        </Box>

        <Box flex="1">
          <Heading size="md">
            {product.title}
          </Heading>

          <Text
            mt={2}
            fontSize="lg"
            fontWeight="600"
          >
            ₹{price.toLocaleString("en-IN")}
          </Text>

          {unavailable && (
            <Text
              mt={3}
              color="error"
              fontWeight="500"
            >
              This product is currently unavailable.
            </Text>
          )}

          {!unavailable && insufficientStock && (
            <Text
              mt={3}
              color="warning"
              fontWeight="500"
            >
              Only {product.stock} units are currently
              available. Please reduce the quantity.
            </Text>
          )}

          <CartItemActions
            productId={product._id}
            quantity={item.quantity}
            stock={product.stock}
            active={product.active}
            price={price}
          />
        </Box>
      </Stack>
    </Box>
  );
};