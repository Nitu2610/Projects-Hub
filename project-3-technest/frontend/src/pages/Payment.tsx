import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAddressByIdQuery } from "../redux/api/addressApi";
import { useGetCartQuery } from "../redux/api/cartApi";
import { useAppSelector } from "../redux/hooks";
import {
  PaymentMethod,
  PaymentMethodType,
} from "../components/payment/PaymentMethod";
import { PaymentSummary } from "../components/payment/PaymentSummary";
import { useCreateOrderMutation } from "../redux/api/orderApi";
import { AddressDetails } from "../components/orders/AddressDetails";

export const Payment = () => {
  const navigate = useNavigate();

  const selectedAddressId = useAppSelector(
    (state) => state.checkout.selectedAddressId,
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("COD");

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMessage, setPaymentMessage] = useState("");

  const {
    data: addressData,
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useGetAddressByIdQuery(selectedAddressId!, {
    skip: !selectedAddressId,
  });

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();

  const cart = cartData?.data;
  const subtotal =
    cart?.items.reduce((sum, item) => {
      const price = item.productId.discountedPrice ?? item.productId.price;

      return sum + price * item.quantity;
    }, 0) ?? 0;

  const shippingCharges = subtotal <= 1000 ? 0 : subtotal < 50000 ? 500 : 1000;

  const total = subtotal + shippingCharges;
  const address = addressData?.data;

  const handlePlaceOrder = async (
    paymentMethod: "COD" | "UPI" | "CARD",
    upiId: string,
    cardType: "CREDIT" | "DEBIT",
  ) => {
    if (!selectedAddressId) {
      return;
    }

    try {
      const response = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
        ...(paymentMethod === "UPI" && {
          paymentData: {
            upiId,
          },
        }),
        ...(paymentMethod === "CARD" && {
          paymentData: {
            cardType,
          },
        }),
      }).unwrap();

      const orderId = response.data._id;

      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  if (!selectedAddressId) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
        direction="column"
        gap={4}
      >
        <Heading size="md">No delivery address selected.</Heading>

        <Button onClick={() => navigate("/checkout")}>Back to Checkout</Button>
      </Flex>
    );
  }

  if (isAddressLoading || isCartLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Text>Loading payment details...</Text>
      </Flex>
    );
  }

  if (isAddressError || !address) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
        direction="column"
        gap={4}
      >
        <Text>Unable to load the selected delivery address.</Text>

        <Button onClick={() => navigate("/checkout")}>Back to Checkout</Button>
      </Flex>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
        direction="column"
        gap={4}
      >
        <Heading size="md">Your cart is empty.</Heading>

        <Button onClick={() => navigate("/cart")}>Back to Cart</Button>
      </Flex>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" px={6} py={10}>
      <Heading mb={8}>Payment</Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
        {/* Left Section */}
        <Stack gap={6}>
          {/* Delivery Address */}
          <Box>
            <Heading size="md" mb={3}>
              Shipping Address
            </Heading>

            <AddressDetails address={address} />
          </Box>

          {/* Payment Methods */}
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            total={total}
            handlePlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            paymentMessage={paymentMessage}
          />
        </Stack>

        {/* Right Section */}
        <PaymentSummary
          items={cart?.items}
          subtotal={subtotal}
          shippingCharges={shippingCharges}
          total={total}
        />
      </SimpleGrid>
    </Box>
  );
};
