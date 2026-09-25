import { Box, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { OrderStatus } from "../../components/OrderStatus";
import { OrderItem } from "../../components/OrderItem";
import { AddressDetails } from "../../components/AddressDetails";
import { OrderPaymentSummary } from "../../components/OrderPaymentSummary";
import { AdminStatusActions } from "../../components/admin/AdminStatusActions";
import { AdminCancelOrderButton } from "../../components/admin/AdminCancelOrderButton";
import { useGetAdminOrderByIdQuery } from "../../api/adminOrderApi";

export const AdminOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAdminOrderByIdQuery(orderId!, {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
        <Text mt={3}>Loading order...</Text>
      </Box>
    );
  }

  if (isError || !response?.data || Array.isArray(response.data)) {
    return (
      <Box p={6}>
        <Heading size="md">Unable to load order</Heading>
        <Text mt={2}>Something went wrong while loading the order.</Text>
      </Box>
    );
  }

  const order = response.data;
  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Order Details
      </Heading>

      <Stack gap={6}>
        {/* Order information */}
        <Box>
          <Heading size="md" mb={3}>
            Order Information
          </Heading>

          <Text>Order ID: {order._id}</Text>

          <OrderStatus status={order.orderStatus} />

          <Text mt={2}>
            Placed On: {new Date(order.createdAt).toLocaleString()}
          </Text>
        </Box>

        {/* Order items */}
        <Box>
          <Heading size="md" mb={3}>
            Order Items
          </Heading>

          <Stack gap={4}>
            {order.items.map((item) => (
              <OrderItem key={item.productId} item={item} />
            ))}
          </Stack>
        </Box>

        {/* Shipping address */}
        <Box>
          <Heading size="md" mb={3}>
            Shipping Address
          </Heading>

          <AddressDetails address={order.shippingAddress} />
        </Box>

        {/* Payment summary */}
        <Box>
          <Heading size="md" mb={3}>
            Payment Details
          </Heading>

          <OrderPaymentSummary
            paymentMethod={order.paymentMethod}
            paymentStatus={order.paymentStatus}
            totalAmount={order.totalAmount}
          />
        </Box>

        {/* Admin actions will come here */}
        <Box>
          <Heading size="md" mb={3}>
            Admin Actions
          </Heading>

          <Stack direction="row">
            <AdminStatusActions
              orderId={order._id}
              currentStatus={order.orderStatus}
            />

            <AdminCancelOrderButton
              orderId={order._id}
              currentStatus={order.orderStatus}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
