import { Box, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { CancelOrderButton } from "./CancelOrderButton";
import { OrderStatus } from "./OrderStatus";
import { OrderSummary } from "./OrderSummary";

import type { Order } from "../../types/order.types";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/orders/${order._id}`);
  };

  return (
    <Box mt={4}>
      <Stack gap={3}>
        <OrderSummary
          orderId={order._id}
          totalAmount={order.totalAmount}
        />

        <OrderStatus status={order.orderStatus} />

        <Stack direction="row" gap={3}>
          <Button onClick={handleViewDetails}>
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