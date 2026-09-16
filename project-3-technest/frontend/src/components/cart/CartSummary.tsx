import { Button, Box, Heading, Text } from "@chakra-ui/react";
import { useClearCartMutation } from "../../redux/api/cartApi";

interface CartSummaryProps {
  total: number;
}

export const CartSummary = ({ total }: CartSummaryProps) => {
  const [clearCart, { isLoading }] = useClearCartMutation();

  return (
    <Box borderWidth="1px" p={5} mt={8}>
      <Heading size="md">Cart Summary</Heading>

      <Text mt={4} fontSize="xl" fontWeight="bold">
        Total: ₹{total.toFixed(2)}
      </Text>

      <Button
        mt={4}
        onClick={() => clearCart()}
        disabled={isLoading}
      >
        {isLoading ? "Clearing..." : "Clear Cart"}
      </Button>
    </Box>
  );
};

