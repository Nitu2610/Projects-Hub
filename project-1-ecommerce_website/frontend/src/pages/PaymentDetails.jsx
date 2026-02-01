import { Box, Container, Heading, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkoutPaymentMethod } from "../redux/checkoutSlice";

export const PaymentDetails = () => {
  const [paymentChoice, setPaymentChoice] = useState(null);
  const dispatch = useDispatch();

  const arr = [
    "UPI",
    "Cash On Delivery (COD)",
    "Credit Card",
    "Debit Card",
    "Internet Banking",
  ];
  useEffect(() => {
    if (!paymentChoice) {
      setPaymentChoice(arr[1]);
      dispatch(checkoutPaymentMethod(arr[1]));
    }
  }, [paymentChoice, dispatch]);

  return (
    <Container>
      <Heading>Select the Payment method:</Heading>

      <Container marginTop={"60px"}>
        <VStack gap={8}>
          {arr.map((options, index) => {
            return (
              <Box
                key={index}
                p={"3"}
                w={"300px"}
                cursor="pointer"
                boxShadow={
                  paymentChoice === options
                    ? "rgba(26, 136, 240, 0.16) 0px 1px 4px, rgb(26, 136, 240) 0px 0px 0px 2px"
                    : "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                }
                borderRadius={5}
                _hover={{
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px",
                }}
                onClick={() => {
                  setPaymentChoice(options);
                  dispatch(checkoutPaymentMethod(options));
                }}
              >
                {options}
              </Box>
            );
          })}
        </VStack>
      </Container>
    </Container>
  );
};
