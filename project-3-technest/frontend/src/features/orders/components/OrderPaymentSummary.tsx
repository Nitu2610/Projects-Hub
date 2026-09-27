import { Stack, Text } from "@chakra-ui/react";
import type {
  PaymentMethod,
  PaymentStatus,
} from "../../../types/order.types";

export interface OrderPaymentSummaryProps {
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
}

export const OrderPaymentSummary = ({
  paymentMethod,
  paymentStatus,
  totalAmount,
}: OrderPaymentSummaryProps) => {
  return (
    <Stack
      gap={3}
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      bg="bg.panel"
      p={5}
    >
      <Text>
        <Text as="span" color="fg.muted">
          Method:{" "}
        </Text>
        {paymentMethod}
      </Text>

      <Text>
        <Text as="span" color="fg.muted">
          Status:{" "}
        </Text>
        {paymentStatus}
      </Text>

      <Text
        fontSize="lg"
        fontWeight="700"
      >
        Total: ₹{totalAmount.toLocaleString("en-IN")}
      </Text>
    </Stack>
  );
};