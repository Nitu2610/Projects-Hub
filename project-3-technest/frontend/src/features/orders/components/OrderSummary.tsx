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
      <Text
        fontSize="sm"
        color="fg.muted"
        wordBreak="break-all"
      >
        Order ID: {orderId}
      </Text>

      <Text
        fontSize="lg"
        fontWeight="700"
      >
        ₹{totalAmount.toLocaleString("en-IN")}
      </Text>
    </Stack>
  );
};