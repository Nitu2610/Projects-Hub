import { Box, Heading, Text } from "@chakra-ui/react";
import { useGetOrdersQuery } from "../api/orderApi";
import { Order } from "../../../types/order.types";
import { OrderCard } from "../components/OrderCard";

export const Orders = () => {
  const { data, isLoading, isError } = useGetOrdersQuery(undefined);

  if (isLoading) {
    return <Text>Loading orders...</Text>;
  }

  if (isError) {
    return <Text>Failed to load orders.</Text>;
  }

  const orders = data?.data ?? [];

  if (orders.length === 0) {
    return (
      <Box>
        <Heading size="lg">My Orders</Heading>
        <Text mt={4}>You haven't placed any orders yet.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg">My Orders</Heading>

      {orders.map((order: Order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </Box>
  );
};
