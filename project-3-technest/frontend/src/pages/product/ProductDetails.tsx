import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { useAddToCartMutation } from "../../redux/api/cartApi";
import { useGetProductDetailsQuery } from "../../redux/api/productApi";
import { ReviewSection } from "../../components/review/ReviewSection";


export const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetProductDetailsQuery(productId ?? "", {
    skip: !productId,
  });

  const [
    addToCart,
    { isLoading: isAddingToCart },
  ] = useAddToCartMutation();

  if (isLoading) {
    return <Heading>Loading...</Heading>;
  }

  if (isError || !data?.data) {
    let errorMessage = "Unable to load product.";

    if (error && "status" in error) {
      errorMessage = `Error: ${String(error.status)}`;
    }

    return <Heading>{errorMessage}</Heading>;
  }

  const product = data.data;

  const effectivePrice =
    product.discountedPrice ?? product.price;

  const handleAddToCart = async () => {
    await addToCart({
      productId: product._id,
      quantity: 1,
    });
  };

  return (
    <Box maxW="1000px" mx="auto" p={6}>
      {/* Product details */}
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={8}
      >
        <Box flex="1">
          {product.images?.length > 0 && (
            <Image
              src={product.images[0].url}
              alt={product.title}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          )}
        </Box>

        <Box flex="1">
          <Heading size="xl">
            {product.title}
          </Heading>

          <Text mt={4}>
            {product.description}
          </Text>

          <Text
            mt={4}
            fontSize="2xl"
            fontWeight="bold"
          >
            ₹{effectivePrice}
          </Text>

          {product.discountedPrice !== undefined &&
            product.discountedPrice !== null && (
              <Text textDecoration="line-through">
                ₹{product.price}
              </Text>
            )}

          <Text mt={4}>
            Category: {product.category.name}
          </Text>

          <Text mt={2}>
            Stock: {product.stock}
          </Text>

          <Button
            mt={6}
            onClick={handleAddToCart}
            disabled={
              product.stock === 0 ||
              isAddingToCart
            }
          >
            {product.stock === 0
              ? "Out of Stock"
              : isAddingToCart
                ? "Adding..."
                : "Add to Cart"}
          </Button>
        </Box>
      </Stack>

      {/* Customer reviews */}
      <Box mt={12}>
        <ReviewSection productId={product._id} />
      </Box>
    </Box>
  );
};