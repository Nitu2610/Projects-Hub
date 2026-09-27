import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { OrderStatus } from "../../components/OrderStatus";
import { OrderItem } from "../../components/OrderItem";
import { AddressDetails } from "../../components/AddressDetails";
import { OrderPaymentSummary } from "../../components/OrderPaymentSummary";
import { AdminStatusActions } from "../../components/admin/AdminStatusActions";
import { AdminCancelOrderButton } from "../../components/admin/AdminCancelOrderButton";
import { LoadingComp } from "../../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../../components/shared/ErrorComp";
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

  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingComp />;
  }

  if (
    isError ||
    !response?.data ||
    Array.isArray(response.data)
  ) {
    return (
      <ErrorComp message="Unable to load this order. Please try again." />
    );
  }

  const order = response.data;

  return (
    <Box bg="bg" minH="100vh" py={{ base: 5, md: 8 }}>
      <Container maxW="1100px">
        <Box mb={6}>
          <Heading fontSize={{ base: "2xl", md: "3xl" }}>
            Order Details
          </Heading>

          <Text mt={1} color="fg.muted">
            Review order information and manage its status.
          </Text>
        </Box>

        <Stack gap={6}>
          {/* Order Information */}
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <Heading size="md" mb={4}>
              Order Information
            </Heading>

            <Stack gap={3}>
              <Box>
                <Text fontSize="sm" color="fg.muted">
                  Order ID
                </Text>

                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  wordBreak="break-all"
                >
                  {order._id}
                </Text>
              </Box>

              <OrderStatus status={order.orderStatus} />

              <Box>
                <Text fontSize="sm" color="fg.muted">
                  Placed On
                </Text>

                <Text>
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </Text>
              </Box>
            </Stack>
          </Box>

          {/* Order Items */}
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <Heading size="md" mb={4}>
              Order Items
            </Heading>

            <Stack gap={4}>
              {order.items.map((item) => (
                <OrderItem
                key={item.productId}
  item={item}
  isDelivered={order.orderStatus === "DELIVERED"}
                />
              ))}
            </Stack>
          </Box>

          {/* Shipping Address */}
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <Heading size="md" mb={4}>
              Shipping Address
            </Heading>

            <AddressDetails address={order.shippingAddress} />
          </Box>

          {/* Payment Details */}
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <Heading size="md" mb={4}>
              Payment Details
            </Heading>

            <OrderPaymentSummary
              paymentMethod={order.paymentMethod}
              paymentStatus={order.paymentStatus}
              totalAmount={order.totalAmount}
            />
          </Box>

          {/* Admin Actions */}
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <Heading size="md" mb={4}>
              Admin Actions
            </Heading>

            <Stack
              direction={{ base: "column", sm: "row" }}
              gap={3}
            >
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
          <Button
  variant="outline"
  onClick={() => navigate("/admin/orders")}
>
  ←  Back to Orders
</Button>
        </Stack>
      </Container>
    </Box>
  );
};