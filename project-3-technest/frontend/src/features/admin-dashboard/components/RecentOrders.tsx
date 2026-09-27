import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Table,
  Text,
} from "@chakra-ui/react";
import { FiShoppingBag } from "react-icons/fi";

import type { RecentOrder } from "../../../types/admin-dashboard";

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "green";
    case "SHIPPED":
      return "blue";
    case "CONFIRMED":
      return "purple";
    case "PLACED":
      return "orange";
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

const getPaymentColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "green";
    case "PENDING":
      return "orange";
    case "FAILED":
      return "red";
    case "REFUNDED":
      return "purple";
    default:
      return "gray";
  }
};

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const RecentOrders = ({
  orders,
}: RecentOrdersProps) => {
  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      p={5}
      overflow="hidden"
    >
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={2}
        mb={5}
      >
        <Box>
          <HStack gap={2}>
            <Box color="primary">
              <FiShoppingBag size={20} />
            </Box>

            <Heading size="md">
              Recent Orders
            </Heading>
          </HStack>

          <Text
            fontSize="sm"
            color="fg.muted"
            mt={1}
          >
            Latest customer orders
          </Text>
        </Box>

        <Text fontSize="sm" color="fg.muted">
          {orders.length} orders
        </Text>
      </Flex>

      {orders.length === 0 ? (
        <Box py={10} textAlign="center">
          <Text color="fg.muted">
            No recent orders found.
          </Text>
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table.Root
            variant="outline"
            size="md"
            minW="850px"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Order</Table.ColumnHeader>
                <Table.ColumnHeader>Customer</Table.ColumnHeader>
                <Table.ColumnHeader>Amount</Table.ColumnHeader>
                <Table.ColumnHeader>Payment</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order._id}>
                  <Table.Cell>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                    >
                      #{order._id.slice(-6).toUpperCase()}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        {order.customer?.fullName ||
                          "Guest Customer"}
                      </Text>

                      {order.customer?.email && (
                        <Text
                          fontSize="xs"
                          color="fg.muted"
                        >
                          {order.customer.email}
                        </Text>
                      )}
                    </Box>
                  </Table.Cell>

                  <Table.Cell>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                    >
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Box>
                      <Badge
                        colorPalette={getPaymentColor(
                          order.paymentStatus
                        )}
                        variant="subtle"
                      >
                        {order.paymentStatus}
                      </Badge>

                      <Text
                        fontSize="xs"
                        color="fg.muted"
                        mt={1}
                        textTransform="uppercase"
                      >
                        {order.paymentMethod}
                      </Text>
                    </Box>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      colorPalette={getStatusColor(
                        order.orderStatus
                      )}
                      variant="subtle"
                    >
                      {order.orderStatus}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell>
                    <Text
                      fontSize="sm"
                      color="fg.muted"
                    >
                      {formatDate(order.createdAt)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};