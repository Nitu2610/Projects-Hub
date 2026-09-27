import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

import {
  useAddToCartMutation,
  useDeleteCartItemMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
} from "../../cart/api/cartApi";

import { useGetUserProfileQuery } from "../../customers/api/customerApi";

import { ReviewSection } from "../../reviews/components/ReviewSection";
import { ProductImageGallery } from "../components/ProductImageGallery";
import { ProductSpecifications } from "../components/ProductSpecifications";
import { useGetProductDetailsQuery } from "../api/productApi";
import { LoadingComp } from "../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../components/shared/ErrorComp";

export const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetProductDetailsQuery(
    productId ?? "",
    {
      skip: !productId,
    },
  );

  const { data: profileData } = useGetUserProfileQuery();

  const user = profileData?.data;
  const isAuthenticated = !!user;

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [updateCartItem, { isLoading: isUpdatingCart }] =
    useUpdateCartItemMutation();

  const [deleteCartItem, { isLoading: isDeletingCart }] =
    useDeleteCartItemMutation();

if (isLoading) {
  return <LoadingComp />;
}

  if (isError) {
    const status =
      error && "status" in error && typeof error.status === "number"
        ? error.status
        : undefined;

    return <ErrorComp status={status} message="Unable to load product." />;
  }

  if (!data?.data) {
    return <ErrorComp message="Product not found." />;
  }

  const product = data.data;

  const effectivePrice = product.discountedPrice ?? product.price;

  const hasDiscount =
    product.discountedPrice !== undefined &&
    product.discountedPrice !== null &&
    product.discountedPrice < product.price;

  const cartItem = cartData?.data?.items.find(
    (item) => item.productId._id === product._id,
  );

  const cartQuantity = cartItem?.quantity ?? 0;

  const isCartUpdating = isAddingToCart || isUpdatingCart || isDeletingCart;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await addToCart({
      productId: product._id,
      quantity: 1,
    });
  };

  const handleIncreaseQuantity = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (cartQuantity >= product.stock) {
      return;
    }

    await updateCartItem({
      productId: product._id,
      quantity: cartQuantity + 1,
    });
  };

  const handleDecreaseQuantity = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (cartQuantity <= 0) {
      return;
    }

    if (cartQuantity === 1) {
      await deleteCartItem(product._id);
      return;
    }

    await updateCartItem({
      productId: product._id,
      quantity: cartQuantity - 1,
    });
  };
  return (
    <Box maxW="1200px" mx="auto" p={{ base: 4, md: 6 }}>
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={{ base: 8, md: 12 }}
      >
        {/* Product Images */}
        <Box flex="1">
          <ProductImageGallery
            images={product.images ?? []}
            productTitle={product.title}
          />
        </Box>

        {/* Product Information */}
        <Box flex="1">
          {/* Brand */}
          <Text
            fontSize="sm"
            fontWeight="600"
            color="fg.muted"
            textTransform="uppercase"
            letterSpacing="wide"
            mb={2}
          >
            {product.brand}
          </Text>

          {/* Title */}
          <Heading size="xl">{product.title}</Heading>

          {/* Description */}
          <Text mt={4} color="fg.muted" lineHeight="1.7">
            {product.description}
          </Text>

          {/* Price */}
          <Box mt={6}>
            <Stack direction="row" align="center" gap={3}>
              <Text fontSize="2xl" fontWeight="700">
                ₹{effectivePrice}
              </Text>

              {hasDiscount && (
                <Text
                  textDecoration="line-through"
                  color="fg.muted"
                  fontSize="md"
                >
                  ₹{product.price}
                </Text>
              )}
            </Stack>
          </Box>

          {/* Stock */}
          <Text
            mt={4}
            fontWeight="500"
            color={product.stock > 0 ? "success" : "error"}
          >
            {product.stock > 0
              ? product.stock < 5
                ? `Only ${product.stock} left in stock`
                : `${product.stock} items available`
              : "Out of Stock"}
          </Text>

          {/* Specifications */}
          <ProductSpecifications specification={product.specification} />

          {/* Cart Controls */}
          <Box mt={8}>
            {!isAuthenticated ? (
              <Button
                width={{
                  base: "100%",
                  sm: "fit-content",
                }}
                onClick={() => navigate("/login")}
              >
                Login to Add to Cart
              </Button>
            ) : cartQuantity === 0 ? (
              <Button
                width={{
                  base: "100%",
                  sm: "fit-content",
                }}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isCartUpdating}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : isAddingToCart
                    ? "Adding..."
                    : "Add to Cart"}
              </Button>
            ) : (
              <Stack
                direction="row"
                align="center"
                width="fit-content"
                borderWidth="1px"
                borderColor="border"
                borderRadius="lg"
                overflow="hidden"
                bg="bg.panel"
              >
                <Button
                  borderRadius="0"
                  variant="ghost"
                  minW="44px"
                  onClick={handleDecreaseQuantity}
                  disabled={isCartUpdating}
                >
                  −
                </Button>

                <Text minW="44px" textAlign="center" fontWeight="600">
                  {cartQuantity}
                </Text>

                <Button
                  borderRadius="0"
                  variant="ghost"
                  minW="44px"
                  onClick={handleIncreaseQuantity}
                  disabled={isCartUpdating || cartQuantity >= product.stock}
                >
                  +
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Stack>

      {/* Reviews */}
      <Box mt={{ base: 10, md: 14 }}>
        <ReviewSection productId={product._id} />
      </Box>
    </Box>
  );
};
