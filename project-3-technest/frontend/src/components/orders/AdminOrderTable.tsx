import {
  Table,
} from "@chakra-ui/react";

import type { Order } from "../../types/order.types";
import { AdminOrderRow } from "./AdminOrderRow";

interface AdminOrderTableProps {
  orders: Order[];
}

export const AdminOrderTable = ({
  orders,
}: AdminOrderTableProps) => {
  return (
    <Table.Root variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Order ID</Table.ColumnHeader>
          <Table.ColumnHeader>Customer</Table.ColumnHeader>
          <Table.ColumnHeader>Date</Table.ColumnHeader>
          <Table.ColumnHeader>Total</Table.ColumnHeader>
          <Table.ColumnHeader>Payment</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Action</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {orders.map((order) => (
          <AdminOrderRow
            key={order._id}
            order={order}
          />
        ))}
      </Table.Body>
    </Table.Root>
  );
};