import { Button, Table } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import type { Order } from "../../../../types/order.types";

interface AdminOrderRowProps {
  order: Order;
}

export const AdminOrderRow = ({ order }: AdminOrderRowProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/admin/orders/${order._id}`);
  };

  return (
    <Table.Row color={"black"}>
      <Table.Cell>{order._id}</Table.Cell>

      <Table.Cell>{order.userId.fullName}</Table.Cell>

      <Table.Cell>{new Date(order.createdAt).toLocaleDateString()}</Table.Cell>

      <Table.Cell>₹{order.totalAmount}</Table.Cell>

      <Table.Cell>
        {order.paymentMethod} ({order.paymentStatus})
      </Table.Cell>

      <Table.Cell>{order.orderStatus}</Table.Cell>

      <Table.Cell>
        <Button size="sm" onClick={handleViewDetails}>
          View
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};
