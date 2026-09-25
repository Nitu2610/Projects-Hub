import { Box, Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { CartItem } from "../../../types/cart.types";



interface PaymentSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCharges: number;
  total: number;
}

export const PaymentSummary = ({
  items,
  subtotal,
  shippingCharges,
  total,
}: PaymentSummaryProps) => {
  return (
    <Card.Root>
      <Card.Body>
        <Stack gap={4}>
          <Heading size="md">Order Summary</Heading>

          {items.map((item) => {
            const price =
              item.productId.discountedPrice ?? item.productId.price;

            const itemTotal = price * item.quantity;

            return (
              <Flex key={item.productId._id} justify="space-between" gap={4}>
                <Box>
                  <Text fontWeight="medium">{item.productId.title}</Text>

                  <Text fontSize="sm">
                    ₹{price.toLocaleString("en-IN")} × {item.quantity}
                  </Text>
                </Box>

                <Text fontWeight="medium">
                  ₹{itemTotal.toLocaleString("en-IN")}
                </Text>
              </Flex>
            );
          })}

          <Box borderTopWidth="1px" pt={4}>
            <Stack gap={3}>
              <Flex justify="space-between">
                <Text>Subtotal</Text>

                <Text>₹{subtotal.toLocaleString("en-IN")}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text>Shipping</Text>

                <Text>
                  {shippingCharges === 0
                    ? "Free"
                    : `₹${shippingCharges.toLocaleString("en-IN")}`}
                </Text>
              </Flex>

              <Flex justify="space-between" borderTopWidth="1px" pt={3}>
                <Text fontWeight="bold">Total</Text>

                <Text fontWeight="bold">₹{total.toLocaleString("en-IN")}</Text>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
