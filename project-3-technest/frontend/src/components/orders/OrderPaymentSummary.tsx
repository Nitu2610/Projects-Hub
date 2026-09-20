import { Stack, Text } from "@chakra-ui/react";

import type {
  PaymentMethod,
  PaymentStatus,
} from "../../types/order.types";

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
    <Stack gap={1}>
      <Text>
        Method: {paymentMethod}
      </Text>

      <Text>
        Status: {paymentStatus}
      </Text>

      <Text fontWeight="bold">
        Total: ₹{totalAmount}
      </Text>
    </Stack>
  );
};