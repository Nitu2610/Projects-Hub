import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { OrderItem as OrderItemType } from "../../../types/order.types";

interface OrderItemProps {
  item: OrderItemType;
  isDelivered: boolean;
}

export const OrderItem = ({ item, isDelivered }: OrderItemProps) => {
  const navigate = useNavigate();

  const handleReview = () => {
    navigate(`/products/${item.productId}`);
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      bg="bg.panel"
      p={4}
    >
      <Stack gap={1}>
        <Text fontWeight="600">{item.productName}</Text>

        <Text fontSize="sm" color="fg.muted">
          Quantity: {item.quantity}
        </Text>

        <Text fontSize="sm">
          Price: ₹{item.purchasedPrice.toLocaleString("en-IN")}
        </Text>

        <Text fontWeight="600">
          Subtotal: ₹{item.subtotal.toLocaleString("en-IN")}
        </Text>

        {isDelivered && (
          <Button
            mt={3}
            width={{ base: "100%", sm: "fit-content" }}
            alignSelf={{ base: "stretch", sm: "flex-start" }}
            onClick={handleReview}
          >
            Review Product
          </Button>
        )}
      </Stack>
    </Box>
  );
};