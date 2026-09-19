import { Stack, Text } from "@chakra-ui/react";

interface OrderSummaryProps {
  orderId: string;
  totalAmount: number;
}

export const OrderSummary = ({
  orderId,
  totalAmount,
}: OrderSummaryProps) => {
  return (
    <Stack gap={1}>
      <Text>Order ID: {orderId}</Text>
      <Text>Total: ₹{totalAmount}</Text>
    </Stack>
  );
};