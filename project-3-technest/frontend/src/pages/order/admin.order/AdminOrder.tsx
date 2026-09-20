import { Box, Heading, Spinner, Text } from "@chakra-ui/react";

import { useGetAdminOrdersQuery } from "../../../redux/api/adminOrderApi";
import { AdminOrderTable } from "../../../components/orders/AdminOrderTable";

export const AdminOrders = () => {
  const { data: response, isLoading, isError } = useGetAdminOrdersQuery();

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
        <Text mt={3}>Loading orders...</Text>
      </Box>
    );
  }

  if (isError || !response?.data) {
    return (
      <Box p={6}>
        <Heading size="md">Unable to load orders</Heading>
        <Text mt={2}>Something went wrong while loading orders.</Text>
      </Box>
    );
  }

  const orders = Array.isArray(response.data) ? response.data : [];

  if (orders.length === 0) {
    return (
      <Box p={6}>
        <Heading size="lg">Orders</Heading>
        <Text mt={4}>No orders found.</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Orders
      </Heading>

      <AdminOrderTable orders={orders} />
    </Box>
  );
};
