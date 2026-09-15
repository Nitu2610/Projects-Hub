import { Box, Heading, Image, Text, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../redux/api/productApi";

export const ProductDetails = () => {
  const { productId } = useParams();

  const { data, isLoading, isError, error } = useGetProductDetailsQuery(
    productId!, // Typescript non-null assertion operation for typescript error.
    {
      skip: !productId,
      //     RTK Query skip → frontend: don't execute the query when the required value isn't available.
      // MongoDB $skip → backend/database aggregation: skip a specified number of documents, typically for pagination.
    },
  );

  if (isLoading) {
    return <Heading>Loading... </Heading>;
  }

  if (isError || !data?.data) {
    return (
      <Heading>
        {error && ( // To tackel the error - Type 'FetchBaseQueryError | SerializedError | undefined' is not assignable to type 'ReactNode'.
          <Heading>
            {"status" in error ? `Error: ${error.status}` : error.message}
          </Heading>
        )}
      </Heading>
    );
  }

  const product = data.data;

  return (
    <Box maxW="1000px" mx="auto" p={6}>
      <Stack direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex="1">
          <Image
            src={product.image}
            alt={product.title}
            w="100%"
            maxH="450px"
            objectFit="contain"
          />
        </Box>

        <Box flex="1">
          <Heading size="xl">{product.title}</Heading>

          <Text mt={4}>{product.description}</Text>

          <Text mt={4} fontSize="2xl" fontWeight="bold">
            ₹{product.discountedPrice ?? product.price}
          </Text>

          {product.discountedPrice && (
            <Text textDecoration="line-through">₹{product.price}</Text>
          )}

          <Text mt={4}>Category: {product.category.name}</Text>

          <Text mt={2}>Stock: {product.stock}</Text>
        </Box>
      </Stack>
    </Box>
  );
};
