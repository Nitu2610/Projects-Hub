import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../api/productApi";

import {
  ProductForm,
  ProductFormData,
} from "../../components/admin/ProductForm";

import { LoadingComp } from "../../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../../components/shared/ErrorComp";

export const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading: isProductLoading,
    isError,
  } = useGetProductDetailsQuery(productId!, {
    skip: !productId,
  });

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  if (isProductLoading) {
    return <LoadingComp />;
  }

  if (isError || !response?.data) {
    return (
      <ErrorComp message="Unable to load this product. Please try again." />
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
    <Box bg="bg" minH="100vh" py={{ base: 5, md: 8 }}>
      <Container maxW="1100px">
        <Box mb={6}>
          <Heading fontSize={{ base: "2xl", md: "3xl" }}>
            Edit Product
          </Heading>

          <Text mt={1} color="fg.muted">
            Update product information and inventory details.
          </Text>
        </Box>

        <Box
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
        >
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </Box>
      </Container>
    </Box>
  );
};