import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BackToHome } from "../components/buttons/BackToHome";
import { resetCheckout } from "../redux/checkoutSlice";
import { clearCart } from "../redux/cartSlice";

import { api } from "../api/axios";

export const OrderSummary = () => {
  const dispatch = useDispatch();
  const navTo = useNavigate();
  const { cartItems, deliveryAddress, paymentMethod } = useSelector(
    (state) => state.checkout
  );

  const [processing, setProcessing] = useState({
    loading: false,
    error: null,
    success: false,
    orderNum: "",
  });

  const formatPrice = (price) =>
    price.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePlaceOrder = async (cartItems, deliveryAddress, paymentMethod) => {
    setProcessing({ loading: true, error: null, success: false, orderNum: "" });

    const orderId = Date.now();
    const orderDetails = { OrderedProduct: cartItems, DeliveryAddress: deliveryAddress, PaymentMode: paymentMethod, orderId };

    try {
      await fakeDelay(2000);
      await api.post(`/orders`, orderDetails);

      setProcessing({ loading: false, success: true, orderNum: orderId, error: null });
      dispatch(resetCheckout());
      dispatch(clearCart());
    } catch (error) {
      setProcessing({ loading: false, success: false, orderNum: "", error: "Failed to place the order" });
    }
  };

  if (processing.loading) {
    return (
      <Container centerContent py={10}>
        <Heading mb={4}>Processing Order...</Heading>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (processing.error) {
    return (
      <Container centerContent py={10}>
        <Heading mb={4}>Error: {processing.error}</Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      {processing.success ? (
        <VStack spacing={6}>
          <Text fontSize="lg">
            Your order has been placed successfully! <br />
            <strong>Order Number:</strong> {processing.orderNum}
          </Text>
          <BackToHome />
        </VStack>
      ) : (
        <>
          <Heading textAlign="center" mb={6}>
            Order Summary
          </Heading>

          {/* Product List */}
          <Heading size="md" mb={4}>
            Product List
          </Heading>
          <VStack spacing={3} align="stretch">
            {cartItems.map((product, i) => (
              <Box key={product.id} p={3} borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold">{product.title}</Text>
                <Text>
                  {`Price: ${formatPrice(product.price * product.productQuantity)}`}
                </Text>
                <Text>
                  {`${product.productQuantity} ${product.productQuantity > 1 ? "pcs" : "pc"}`}
                </Text>
              </Box>
            ))}
          </VStack>

          <Divider my={6} />

          {/* Delivery Address */}
          <Heading size="md" mb={4}>
            Delivery Address
          </Heading>
          <Box p={4} borderRadius="md" boxShadow="md">
            <Text>{deliveryAddress.fName} {deliveryAddress.lName}</Text>
            <Text>+91 {deliveryAddress.mNum}</Text>
            <Text>
              {deliveryAddress.address.houseNum}, {deliveryAddress.address.street},{" "}
              {deliveryAddress.address.landmark}
            </Text>
            <Text>
              {deliveryAddress.address.area}, {deliveryAddress.address.district},{" "}
              {deliveryAddress.address.state} - {deliveryAddress.address.pincode}
            </Text>
            <Text>{deliveryAddress.address.country}</Text>
            <Text>Preferred Time: {deliveryAddress.preferredTime || "N/A"}</Text>
          </Box>

          <Divider my={6} />

          {/* Payment Method */}
          <Heading size="md" mb={4}>
            Payment Method
          </Heading>
          <Text>{paymentMethod}</Text>

          {/* Place Order Button */}
          <Button
            colorScheme="green"
            mt={6}
            w="full"
            onClick={() => handlePlaceOrder(cartItems, deliveryAddress, paymentMethod)}
          >
            Place Order
          </Button>
        </>
      )}
    </Container>
  );
};
