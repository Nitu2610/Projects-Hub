import { Box, Heading, VStack, Text, Divider } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { CheckOutBtn } from "../components/buttons/CheckOutBtn";

export const CartItems = () => {
  const { items } = useSelector((state) => state.cart);

  return (
    <Box p={5}>
      {items.length === 0 ? (
        <Heading textAlign="center" size="md">
          The cart is empty, kindly add the product in the cart.
        </Heading>
      ) : (
        <VStack spacing={4} align="stretch">
          {items.map((product, i) => {
            const { title, productQuantity, price } = product;

            return (
              <Box
                key={i}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="sm"
              >
                <Heading size="sm">
                  {i + 1}. {title}
                </Heading>
                <Text>Quantity: {productQuantity}</Text>
                <Text>Total Price: ₹{price *productQuantity}</Text>
              </Box>
            );
          })}
        </VStack>
      )}
      {items.length === 0 ? " " : <CheckOutBtn/> }
    
    </Box>
  );
};
