import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { CartProducts } from "../components/CartProducts";
import { CartSummary } from "../components/CartSummary";

export const Cart = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [canCheckout, setCanCheckout] =
    useState(false);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!canCheckout) {
      return;
    }

    navigate("/checkout");
  };

  return (
    <Box
      bg="bg"
      minH="calc(100vh - 80px)"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="1200px">
        <VStack
          align="stretch"
          gap={8}
        >
          <Heading
            fontSize={{
              base: "2xl",
              md: "3xl",
            }}
          >
            Shopping Cart
          </Heading>

          <Flex
            direction={{
              base: "column",
              lg: "row",
            }}
            align="stretch"
            gap={{
              base: 6,
              lg: 8,
            }}
          >
            {/* Cart Products */}
            <Box flex="1">
              <CartProducts
                setCartTotal={setCartTotal}
                setCanCheckout={setCanCheckout}
              />
            </Box>

            {/* Cart Summary */}
            <Box
              width={{
                base: "100%",
                lg: "360px",
              }}
              flexShrink={0}
            >
              <VStack
                align="stretch"
                gap={4}
                position={{
                  lg: "sticky",
                }}
                top={{
                  lg: "100px",
                }}
              >
                <CartSummary
                  total={cartTotal}
                />

                {!canCheckout &&
                  cartTotal > 0 && (
                    <Text
                      fontSize="sm"
                      color="warning"
                    >
                      Please resolve the unavailable
                      product or stock issue before
                      proceeding to checkout.
                    </Text>
                  )}

                <Button
                  width="100%"
                  bg="primary"
                  color="white"
                  _hover={{
                    bg: "primary.hover",
                  }}
                  onClick={handleCheckout}
                  disabled={!canCheckout}
                >
                  Proceed to Checkout
                </Button>
              </VStack>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};