import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  RadioGroup,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Address, useGetAddressesQuery } from "./../redux/api/addressApi";
import { useGetCartQuery } from "./../redux/api/cartApi";

import { CartProducts } from "./cart/CartProducts";
import { setSelectedAddressId } from "../redux/slices/checkoutSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Addresses } from "../components/address/Addresses";



export const Checkout = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const selectedAddressId = useAppSelector(
    (state) => state?.checkout.selectedAddressId,
  );

  const { data, isLoading, isError } = useGetAddressesQuery();
  const addresses = data?.data ?? [];

  const { data: cartData } = useGetCartQuery();

  const subtotal = cartData?.data?.items.reduce((sum, item) => {
    const price = item.productId.discountedPrice ?? item.productId.price;

    return sum + price * item.quantity;
  }, 0);

  const shippingCharges =
    subtotal !== undefined
      ? subtotal <= 1000
        ? 0
        : subtotal < 50000
          ? 500
          : 1000
      : 0;

  const total = (subtotal ?? 0) + shippingCharges;

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      dispatch(setSelectedAddressId(addresses[0]._id));
    }
  }, [addresses, selectedAddressId, dispatch]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Text>Unable to load your saved addresses. Please try again.</Text>
      </Flex>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" px={6} py={10}>
      <Heading mb={8}>Checkout</Heading>

     <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
  <Addresses
    isCheckout
    selectedAddressId={selectedAddressId}
    onSelectAddress={addressId =>
      dispatch(setSelectedAddressId(addressId))
    }
  />

  <Box>
    <Heading size="md" mb={4}>
      Order Summary
    </Heading>

    <CartProducts />

    <Card.Root>
      <Card.Body>
        <Stack gap={4}>
          <Flex justify="space-between">
            <Text>Subtotal</Text>
            <Text>
              ₹ {subtotal?.toLocaleString("en-IN")}
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Text>Shipping</Text>
            <Text>
              {shippingCharges === 0
                ? "Free"
                : `₹ ${shippingCharges.toLocaleString("en-IN")}`}
            </Text>
          </Flex>

          <Box borderTopWidth="1px" pt={4}>
            <Flex justify="space-between">
              <Text fontWeight="bold">
                Total
              </Text>

              <Text fontWeight="bold">
                ₹ {total.toLocaleString("en-IN")}
              </Text>
            </Flex>
          </Box>

          <Button
            width="100%"
            disabled={!selectedAddressId}
            onClick={() => navigate("/payment")}
          >
            Continue to Payment
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  </Box>
</SimpleGrid>
    </Box>
  );
};
