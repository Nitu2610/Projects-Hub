import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";

import {
  ProductForm,
  type ProductFormData,
} from "../../../components/products/admin/ProductForm";

export const EditProduct = () => {
  const { productId } = useParams<{
    productId: string;
  }>();

  const navigate = useNavigate();

  const {
    data: response,
    isLoading: isProductLoading,
    isError,
  } = useGetProductDetailsQuery(productId!, {
    skip: !productId,
  });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  if (isProductLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
        <Text mt={3}>Loading product...</Text>
      </Box>
    );
  }

  if (isError || !response?.data || Array.isArray(response.data)) {
    return (
      <Box p={6}>
        <Heading size="md">Unable to load product</Heading>

        <Text mt={2}>Something went wrong while loading the product.</Text>
      </Box>
    );
  }

  const product = response.data;

  const handleSubmit = async (productData: ProductFormData) => {
    try {
      const response = await updateProduct({
        productId: product._id,
        productData,
      }).unwrap();

      if (response.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Edit Product
      </Heading>

      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
};
