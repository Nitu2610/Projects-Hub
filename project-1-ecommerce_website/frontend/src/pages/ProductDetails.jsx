import { Badge, Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BackToHome } from "../components/buttons/BackToHome";
import { AddToCart } from "../components/buttons/AddToCart";
import { RemoveFromCart } from "../components/buttons/RemoveFromCart";
import { Add_Romove_Cart_Container } from "../components/Add_Romove_Cart_Container";

export const ProductDetails = () => {
  const { id } = useParams();
  const storeProducts = useSelector((state) => state.products.productsArray);
  const productDetails = storeProducts.find((item) => item.id === id);
  //console.log(id)
  return (
    <div>
      <h1>ProductDetails</h1>
      {!productDetails ? (
        <Text textAlign="center" mt={10}>
          Product not found.
        </Text>
      ) : (
        <>
          <Box
            w="80%"
            mx="auto"
            mt={10}
            p={6}
            boxShadow="lg"
            borderRadius="md"
            bg="white"
          >
            <Image
              src={productDetails.image}
              alt={productDetails.title}
              w="100%"
              h="300px"
              objectFit="cover"
              borderRadius="md"
              mb={5}
            />

            <Heading size="lg" mb={3}>
              {productDetails.title}
            </Heading>

            <Stack direction="row" align="center" mb={3}>
              <Text fontWeight="bold">Brand:</Text>
              <Text>{productDetails.brand}</Text>
              <Badge colorScheme="purple" ml="auto">
                {productDetails.category}
              </Badge>
            </Stack>

            <Text fontSize="md" mb={3}>
              {productDetails.description}
            </Text>

            <Heading size="md" color="green.600">
              ₹{productDetails.price}
            </Heading>
          </Box>
           <Box w={"80%"} m={'auto'} mt={'20px'}><Add_Romove_Cart_Container item={productDetails} existingItem={productDetails} /></Box>
          <BackToHome />
        </>
      )}
    </div>
  );
};
