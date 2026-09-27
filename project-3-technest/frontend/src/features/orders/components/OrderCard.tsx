import {
  Box,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { CancelOrderButton } from "./CancelOrderButton";
import { OrderStatus } from "./OrderStatus";
import { OrderSummary } from "./OrderSummary";

import type { Order } from "../../../types/order.types";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/orders/${order._id}`);
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      bg="bg.panel"
      p={{ base: 4, md: 5 }}
    >
      <Stack gap={4}>
        <OrderSummary
          orderId={order._id}
          totalAmount={order.totalAmount}
        />

        <OrderStatus status={order.orderStatus} />

        <Stack
          direction={{ base: "column", sm: "row" }}
          gap={3}
        >
          <Button
            onClick={handleViewDetails}
            width={{ base: "100%", sm: "auto" }}
          >
            View Details
          </Button>

          <CancelOrderButton
            orderId={order._id}
            orderStatus={order.orderStatus}
          />
        </Stack>
      </Stack>
    </Box>
  );
};