import { Box, Container, Heading, VStack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkoutPaymentMethod } from "../redux/checkoutSlice";

export const PaymentDetails = () => {
  const [paymentChoice, setPaymentChoice] = useState(null);
  const dispatch = useDispatch();

  const paymentOptions = [
    "UPI",
    "Cash On Delivery (COD)",
    "Credit Card",
    "Debit Card",
    "Internet Banking",
  ];

  // Set default selection on mount
  useEffect(() => {
    if (!paymentChoice) {
      setPaymentChoice(paymentOptions[1]); // Default: COD
      dispatch(checkoutPaymentMethod(paymentOptions[1]));
    }
  }, [paymentChoice, dispatch]);

  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6} size="lg">
        Select Payment Method
      </Heading>

      <VStack spacing={4} align="stretch">
        {paymentOptions.map((option, idx) => (
          <Box
            key={idx}
            p={4}
            cursor="pointer"
            borderRadius="md"
            boxShadow={
              paymentChoice === option
                ? "0 0 0 2px rgb(26, 136, 240), 0 1px 4px rgba(26, 136, 240, 0.16)"
                : "0 1px 3px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(27, 31, 35, 0.15)"
            }
            _hover={{
              boxShadow:
                "0 0 0 2px rgba(6, 24, 44, 0.4), 0 4px 6px -1px rgba(6, 24, 44, 0.65)",
            }}
            onClick={() => {
              setPaymentChoice(option);
              dispatch(checkoutPaymentMethod(option));
            }}
          >
            <Text fontSize="md" fontWeight={paymentChoice === option ? "bold" : "normal"}>
              {option}
            </Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};
