import { Button, Stack } from "@chakra-ui/react";
import type { OrderStatus } from "../../types/order.types";
import { useUpdateAdminOrderStatusMutation } from "../../redux/api/adminOrderApi";

interface AdminStatusActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export const AdminStatusActions = ({
  orderId,
  currentStatus,
}: AdminStatusActionsProps) => {
  const [updateOrderStatus, { isLoading }] =
    useUpdateAdminOrderStatusMutation();

  const handleStatusUpdate = async (orderStatus: OrderStatus) => {
    try {
      await updateOrderStatus({
        orderId,
        orderStatus,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getActions = () => {
    switch (currentStatus) {
      case "PLACED":
        return (
          <Button
            onClick={() => handleStatusUpdate("CONFIRMED")}
            loading={isLoading}
          >
            Confirm Order
          </Button>
        );

      case "CONFIRMED":
        return (
          <Button
            onClick={() => handleStatusUpdate("SHIPPED")}
            loading={isLoading}
          >
            Ship Order
          </Button>
        );

      case "SHIPPED":
        return (
          <Button
            onClick={() => handleStatusUpdate("DELIVERED")}
            loading={isLoading}
          >
            Mark Delivered
          </Button>
        );

      case "DELIVERED":
      case "CANCELLED":
        return null;

      default:
        return null;
    }
  };

  return <Stack direction="row">{getActions()}</Stack>;
};