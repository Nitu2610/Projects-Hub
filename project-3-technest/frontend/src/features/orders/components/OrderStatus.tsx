import { Text } from "@chakra-ui/react";
import type { OrderStatus as OrderStatusType } from "../../../types/order.types";

interface OrderStatusProps {
  status: OrderStatusType;
}

export const OrderStatus = ({ status }: OrderStatusProps) => {
  return <Text>Status: {status}</Text>;
};
