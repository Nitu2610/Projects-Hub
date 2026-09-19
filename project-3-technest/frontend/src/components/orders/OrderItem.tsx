import { Box, Text } from "@chakra-ui/react";

import type { OrderItem as OrderItemType } from "../../types/order.types";

interface OrderItemProps {
  item: OrderItemType;
}

export const OrderItem = ({ item }: OrderItemProps) => {
  return (
    <Box>
      <Text fontWeight="bold">
        {item.productName}
      </Text>

      <Text>
        Quantity: {item.quantity}
      </Text>

      <Text>
        Price: ₹{item.purchasedPrice}
      </Text>

      <Text>
        Subtotal: ₹{item.subtotal}
      </Text>
    </Box>
  );
};