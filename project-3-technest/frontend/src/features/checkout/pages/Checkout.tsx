import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks";

import { useGetAddressesQuery } from "../../address/api/addressApi";
import { useGetCartQuery } from "../../cart/api/cartApi";

import { setSelectedAddressId } from "../../../redux/slices/checkoutSlice";

import { Addresses } from "../../address/components/Addresses";

export const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedAddressId = useAppSelector(
    (state) => state.checkout.selectedAddressId,
  );

  const {
    data: addressData,
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useGetAddressesQuery();

  const addresses = addressData?.data ?? [];

  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useGetCartQuery();

  const cart = cartData?.data;
  const cartItems = cart?.items ?? [];

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      item.productId.discountedPrice ??
      item.productId.price;

    return sum + price * item.quantity;
  }, 0);

  const shippingCharges =
    subtotal <= 1000
      ? 0
      : subtotal < 50000
        ? 500
        : 1000;

  const total = subtotal + shippingCharges;

 const hasInvalidCartItem = cartItems.some((item) => {
  const product = item.productId;

  const isInactive = product.active === false;
  const hasInsufficientStock =
    item.quantity > product.stock;

  return isInactive || hasInsufficientStock;
});

  const canContinueToPayment =
    cartItems.length > 0 &&
    !!selectedAddressId &&
    !hasInvalidCartItem;

  useEffect(() => {
    if (
      addresses.length > 0 &&
      !selectedAddressId
    ) {
      dispatch(
        setSelectedAddressId(addresses[0]._id),
      );
    }
  }, [
    addresses,
    selectedAddressId,
    dispatch,
  ]);

  if (isAddressLoading || isCartLoading) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isAddressError) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
        px={6}
      >
        <Text color="error">
          Unable to load your saved addresses.
          Please try again.
        </Text>
      </Flex>
    );
  }

  if (isCartError || !cart) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
        px={6}
      >
        <Text color="error">
          Unable to load your cart. Please try again.
        </Text>
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
          Checkout
        </Heading>

        <SimpleGrid
          columns={{
            base: 1,
            lg: 2,
          }}
          gap={{ base: 6, lg: 8 }}
        >
          {/* Address Section */}
          <Box>
            <Addresses
              isCheckout
              selectedAddressId={selectedAddressId}
              onSelectAddress={(addressId) =>
                dispatch(
                  setSelectedAddressId(addressId),
                )
              }
            />
          </Box>

          {/* Order Summary */}
          <Box>
            <Card.Root
              bg="bg.panel"
              borderColor="border"
            >
              <Card.Body>
                <Stack gap={5}>
                  <Heading size="md">
                    Order Summary
                  </Heading>

                  {/* Items */}
                  <Stack gap={3}>
                    {cartItems.map((item) => {
                      const product = item.productId;

                      const price =
                        product.discountedPrice ??
                        product.price;

                      return (
                        <Flex
                          key={product._id}
                          justify="space-between"
                          gap={4}
                        >
                          <Box>
                            <Text
                              fontWeight="500"
                              lineClamp={2}
                            >
                              {product.title}
                            </Text>

                            <Text
                              fontSize="sm"
                              color="fg.muted"
                            >
                              Qty: {item.quantity}
                            </Text>
                          </Box>

                          <Text
                            fontWeight="500"
                            whiteSpace="nowrap"
                          >
                            ₹
                            {(
                              price *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Stack>

                  <Box
                    borderTopWidth="1px"
                    borderColor="border"
                    pt={4}
                  >
                    <Stack gap={3}>
                      <Flex justify="space-between">
                        <Text color="fg.muted">
                          Subtotal
                        </Text>

                        <Text>
                          ₹
                          {subtotal.toLocaleString(
                            "en-IN",
                          )}
                        </Text>
                      </Flex>

                      <Flex justify="space-between">
                        <Text color="fg.muted">
                          Shipping
                        </Text>

                        <Text>
                          {shippingCharges === 0
                            ? "Free"
                            : `₹ ${shippingCharges.toLocaleString(
                                "en-IN",
                              )}`}
                        </Text>
                      </Flex>
                    </Stack>
                  </Box>

                  <Box
                    borderTopWidth="1px"
                    borderColor="border"
                    pt={4}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                    >
                      <Text fontWeight="600">
                        Total
                      </Text>

                      <Text
                        fontSize="xl"
                        fontWeight="700"
                      >
                        ₹
                        {total.toLocaleString(
                          "en-IN",
                        )}
                      </Text>
                    </Flex>
                  </Box>

                  {/* Validation Message */}
                  {cartItems.length === 0 && (
                    <Text
                      fontSize="sm"
                      color="warning"
                    >
                      Your cart is empty.
                    </Text>
                  )}

                  {hasInvalidCartItem && (
                    <Text
                      fontSize="sm"
                      color="warning"
                    >
                      Please resolve the unavailable
                      product or stock issue before
                      continuing.
                    </Text>
                  )}

                  {!selectedAddressId &&
                    addresses.length > 0 && (
                      <Text
                        fontSize="sm"
                        color="warning"
                      >
                        Please select a delivery
                        address.
                      </Text>
                    )}

                  {addresses.length === 0 && (
                    <Text
                      fontSize="sm"
                      color="warning"
                    >
                      Please add a delivery address
                      before continuing.
                    </Text>
                  )}

                  <Button
                    width="100%"
                    bg="primary"
                    color="white"
                    _hover={{
                      bg: "primary.hover",
                    }}
                    disabled={!canContinueToPayment}
                    onClick={() =>
                      navigate("/payment")
                    }
                  >
                    Continue to Payment
                  </Button>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};