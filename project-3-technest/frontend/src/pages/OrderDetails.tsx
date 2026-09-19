import { Box, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../redux/api/orderApi";
import { CancelOrderButton } from "../components/orders/CancelOrderButton";
import { AddressDetails } from "../components/AddressDetails";
import { OrderItem } from "../components/orders/OrderItem";
import { OrderPaymentSummary } from "../components/orders/OrderPaymentSummary";
import { OrderStatus } from "../components/orders/OrderStatus";

export const OrderDetails = () => {
  const { orderId } = useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetOrderByIdQuery(orderId!, {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
        <Text mt={3}>Loading order details...</Text>
      </Box>
    );
  }

  if (isError || !response?.data) {
    return (
      <Box p={6}>
        <Heading size="md">Unable to load order</Heading>

        <Text mt={2}>We couldn't find the requested order.</Text>
      </Box>
    );
  }

  const order = response.data;

  return (
    <Box maxW="1000px" mx="auto" p={6}>
      <Stack gap={6}>
        {/* Order Header */}
        <Box>
          <Heading size="lg">Order Details</Heading>

          <Text mt={2}>Order ID: {order._id}</Text>

          <OrderStatus status={order.orderStatus} />

          {order.cancelledAt && (
            <Text>
              Cancelled At: {new Date(order.cancelledAt).toLocaleString()}
            </Text>
          )}

          {order.cancellationReason && (
            <Text>Cancellation Reason: {order.cancellationReason}</Text>
          )}
        </Box>

        {/* Shipping Address */}
        <Box>
          <Heading size="md" mb={3}>
            Shipping Address
          </Heading>

          <AddressDetails address={order.shippingAddress} />
        </Box>

        {/* Items */}
        <Box>
          <Heading size="md" mb={3}>
            Items
          </Heading>

          <Stack gap={4}>
            {order.items.map((item) => (
              <OrderItem key={item.productId} item={item} />
            ))}
          </Stack>
        </Box>

        {/* Payment */}
        <Box>
          <Heading size="md" mb={3}>
            Payment
          </Heading>

          <OrderPaymentSummary
            paymentMethod={order.paymentMethod}
            paymentStatus={order.paymentStatus}
            totalAmount={order.totalAmount}
          />
        </Box>

        {/* Cancel Button */}
        <CancelOrderButton
          orderId={order._id}
          orderStatus={order.orderStatus}
        />
      </Stack>
    </Box>
  );
};
