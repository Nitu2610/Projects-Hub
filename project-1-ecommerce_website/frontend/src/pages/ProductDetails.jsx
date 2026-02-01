import { Badge, Box, Heading, Image, Stack, Text, Flex } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BackToHome } from "../components/buttons/BackToHome";
import { Add_Romove_Cart_Container } from "../components/Add_Romove_Cart_Container";
import { base_API } from "../api/base_api";

export const ProductDetails = () => {
  const { id } = useParams();
  const storeProducts = useSelector((state) => state.products.productsArray);
  const cartItems = useSelector((state) => state.cart.items);

  const productDetails = storeProducts.find((item) => item.id === id);
  const existingItem = cartItems.find((item) => item.id === id);

  if (!productDetails) {
    return (
      <Text textAlign="center" mt={10} fontSize="xl">
        Product not found.
      </Text>
    );
  }

  return (
    <Box w="85%" mx="auto" mt={10}>
      {/* Product Card */}
      <Box
        p={6}
        boxShadow="lg"
        borderRadius="md"
        bg="white"
        display="flex"
        flexDirection={["column", "column", "row"]}
        gap={8}
      >
        {/* Image */}
        <Box
          flex="1"
          h={["250px", "280px"]}
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
        >
          <Image
            src={`${base_API}/${productDetails.image}`}
            alt={productDetails.title}
            objectFit="contain"
            maxW="100%"
            maxH="100%"
            borderRadius="md"
          />
        </Box>

        {/* Product Info */}
        <Box flex="2">
          <Heading size="lg" mb={4}>
            {productDetails.title}
          </Heading>

          <Stack direction="row" align="center" mb={3}>
            <Text fontWeight="bold">Brand:</Text>
            <Text>{productDetails.brand}</Text>
            <Badge colorScheme="purple" ml="auto">
              {productDetails.category}
            </Badge>
          </Stack>

          <Text fontSize="md" mb={4}>
            {productDetails.description}
          </Text>

          <Heading size="md" color="green.600" mb={4}>
            ₹{productDetails.price}
          </Heading>

          <Add_Romove_Cart_Container
            item={productDetails}
            existingItem={existingItem}
          />
        </Box>
      </Box>

      {/* Back Button */}
      <Flex mt={6}>
        <BackToHome />
      </Flex>
    </Box>
  );
};
