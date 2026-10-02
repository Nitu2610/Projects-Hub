import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../redux/hooks";

import {
  PaymentMethod,
  PaymentMethodType,
} from "../components/PaymentMethod";

import { useCreateOrderMutation } from "../../orders/api/orderApi";
import { useGetAddressByIdQuery } from "../../address/api/addressApi";
import { useGetCartQuery } from "../../cart/api/cartApi";

import { AddressDetails } from "../../orders/components/AddressDetails";
import { PaymentSummary } from "../components/PaymentSummary";

export const Payment = () => {
  const navigate = useNavigate();

  const selectedAddressId = useAppSelector(
    (state) => state.checkout.selectedAddressId
  );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("COD");

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const [paymentMessage, setPaymentMessage] =
    useState("");

  const {
    data: addressData,
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useGetAddressByIdQuery(selectedAddressId!, {
    skip: !selectedAddressId,
  });

  const {
    data: cartData,
    isLoading: isCartLoading,
  } = useGetCartQuery();

  const cart = cartData?.data;

  const subtotal =
    cart?.items.reduce((sum, item) => {
      const price =
        item.productId.discountedPrice ??
        item.productId.price;

      return sum + price * item.quantity;
    }, 0) ?? 0;

  const shippingCharges =
    subtotal <= 1000
      ? 0
      : subtotal < 50000
        ? 500
        : 1000;

  const total = subtotal + shippingCharges;

  const address = addressData?.data;

  const handlePlaceOrder = async (
    selectedPaymentMethod: PaymentMethodType,
    upiId: string,
    cardType: "CREDIT" | "DEBIT"
  ) => {
    if (!selectedAddressId) return;

    setPaymentMessage("");

    if (
      selectedPaymentMethod === "UPI" &&
      !upiId.trim()
    ) {
      setPaymentMessage("Please enter your UPI ID.");
      return;
    }

    try {
      const response = await createOrder({
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,

        ...(selectedPaymentMethod === "UPI" && {
          paymentData: {
            upiId: upiId.trim(),
          },
        }),

        ...(selectedPaymentMethod === "CARD" && {
          paymentData: {
            cardType,
          },
        }),
      }).unwrap();

      const orderId = response.data._id;

      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error("Order creation failed:", error);

      setPaymentMessage(
        "Unable to place your order. Please try again."
      );
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
        <Heading size="md">
          No delivery address selected.
        </Heading>

        <Button
          onClick={() => navigate("/checkout")}
        >
          Back to Checkout
        </Button>
      </Flex>
    );
  }

  if (isAddressLoading || isCartLoading) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
      >
        <Text>
          Loading payment details...
        </Text>
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
        <Text>
          Unable to load the selected delivery address.
        </Text>

        <Button
          onClick={() => navigate("/checkout")}
        >
          Back to Checkout
        </Button>
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
        <Heading size="md">
          Your cart is empty.
        </Heading>

        <Button
          onClick={() => navigate("/cart")}
        >
          Back to Cart
        </Button>
      </Flex>
    );
  }

  return (
    <Box
      bg="bg"
      minH="calc(100vh - 80px)"
      py={{ base: 6, md: 10 }}
    >
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
      >
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          mb={8}
        >
          Payment
        </Heading>

        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          gap={{ base: 6, lg: 8 }}
        >
          <Stack gap={6}>
            <Box>
              <Heading size="md" mb={3}>
                Shipping Address
              </Heading>

              <AddressDetails address={address} />
            </Box>
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              total={total}
              handlePlaceOrder={handlePlaceOrder}
              isProcessing={isCreatingOrder}
              paymentMessage={paymentMessage}
            />
          </Stack>

          <PaymentSummary
            items={cart.items}
            subtotal={subtotal}
            shippingCharges={shippingCharges}
            total={total}
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};