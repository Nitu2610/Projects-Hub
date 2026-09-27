import {
  Box,
  Button,
  Heading,
  Separator,
  Text,
} from "@chakra-ui/react";

import { useClearCartMutation } from "../api/cartApi";

interface CartSummaryProps {
  total: number;
}

export const CartSummary = ({
  total,
}: CartSummaryProps) => {
  const [
    clearCart,
    { isLoading },
  ] = useClearCartMutation();

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      bg="bg.panel"
      p={{ base: 5, md: 6 }}
    >
      <Heading size="md">
        Cart Summary
      </Heading>

      <Separator my={5} />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="fg.muted">
          Subtotal
        </Text>

        <Text fontWeight="600">
          ₹{total.toLocaleString("en-IN")}
        </Text>
      </Box>

      <Separator my={5} />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontWeight="600">
          Total
        </Text>

        <Text
          fontSize="xl"
          fontWeight="700"
        >
          ₹{total.toLocaleString("en-IN")}
        </Text>
      </Box>

      <Button
        mt={5}
        width="100%"
        variant="outline"
        onClick={handleClearCart}
        disabled={isLoading || total <= 0}
      >
        {isLoading
          ? "Clearing..."
          : "Clear Cart"}
      </Button>
    </Box>
  );
};