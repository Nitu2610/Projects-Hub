import {
  Box,
  Container,
  Heading,
  Stack,
  Text,Button
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { useGetOrderByIdQuery } from "../api/orderApi";
import { OrderStatus } from "../components/OrderStatus";
import { AddressDetails } from "../components/AddressDetails";
import { OrderItem } from "../components/OrderItem";
import { OrderPaymentSummary } from "../components/OrderPaymentSummary";
import { CancelOrderButton } from "../components/CancelOrderButton";

import { LoadingComp } from "../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../components/shared/ErrorComp";

import { useNavigate } from "react-router-dom";

export const OrderDetails = () => {
  const { orderId } = useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetOrderByIdQuery(orderId ?? "", {
    skip: !orderId,
  });

  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingComp />;
  }

  if (isError || !response?.data) {
    return (
      <ErrorComp message="Unable to load the requested order." />
    );
  }

  const order = response.data;

  return (
    <Box
      bg="bg"
      minH="calc(100vh - 80px)"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="1000px">
        <Stack gap={{ base: 6, md: 8 }}>
          {/* Order Header */}
          <Box>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              Order Details
            </Heading>

            <Text
              mt={2}
              fontSize="sm"
              color="fg.muted"
              wordBreak="break-all"
            >
              Order ID: {order._id}
            </Text>

            <Box mt={4}>
              <OrderStatus status={order.orderStatus} />
            </Box>

            {order.cancelledAt && (
              <Text mt={3} fontSize="sm" color="fg.muted">
                Cancelled At:{" "}
                {new Date(order.cancelledAt).toLocaleString()}
              </Text>
            )}

            {order.cancellationReason && (
              <Text mt={1} fontSize="sm" color="fg.muted">
                Cancellation Reason: {order.cancellationReason}
              </Text>
            )}
          </Box>

          {/* Shipping Address */}
          <Box>
            <Heading size="md" mb={3}>
              Shipping Address
            </Heading>

            <AddressDetails
              address={order.shippingAddress}
            />
          </Box>

          {/* Order Items */}
          <Box>
            <Heading size="md" mb={3}>
              Items
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

          {/* Cancellation */}
          <CancelOrderButton
            orderId={order._id}
            orderStatus={order.orderStatus}
          />

                <Button
            variant="outline"
            onClick={() => navigate("/orders")}
          >
            ←  Back to Orders
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};