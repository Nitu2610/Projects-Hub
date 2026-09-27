import {
  Box,
  Card,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

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
    <Card.Root
      bg="bg.panel"
      borderColor="border"
    >
      <Card.Body>
        <Stack gap={4}>
          <Heading size="md">
            Order Summary
          </Heading>

          {items.map((item) => {
            const price =
              item.productId.discountedPrice ??
              item.productId.price;

            const itemTotal =
              price * item.quantity;

            return (
              <Flex
                key={item.productId._id}
                justify="space-between"
                gap={4}
              >
                <Box>
                  <Text fontWeight="500">
                    {item.productId.title}
                  </Text>

                  <Text
                    fontSize="sm"
                    color="fg.muted"
                  >
                    ₹{price.toLocaleString("en-IN")} ×{" "}
                    {item.quantity}
                  </Text>
                </Box>

                <Text
                  fontWeight="500"
                  whiteSpace="nowrap"
                >
                  ₹{itemTotal.toLocaleString("en-IN")}
                </Text>
              </Flex>
            );
          })}

          <Box
            borderTopWidth="1px"
            borderColor="border"
            pt={4}
          >
            <Stack gap={3}>
              <Flex justify="space-between">
                <Text color="fg.muted">
                  Subtotal
                </Text>

                <Text>
                  ₹{subtotal.toLocaleString("en-IN")}
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="fg.muted">
                  Shipping
                </Text>

                <Text>
                  {shippingCharges === 0
                    ? "Free"
                    : `₹${shippingCharges.toLocaleString(
                        "en-IN"
                      )}`}
                </Text>
              </Flex>

              <Flex
                justify="space-between"
                borderTopWidth="1px"
                borderColor="border"
                pt={3}
              >
                <Text fontWeight="700">
                  Total
                </Text>

                <Text fontWeight="700">
                  ₹{total.toLocaleString("en-IN")}
                </Text>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};