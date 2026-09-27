import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useAddProductMutation } from "../../api/productApi";
import {
  ProductForm,
  ProductFormData,
} from "../../components/admin/ProductForm";

export const AddProduct = () => {
  const navigate = useNavigate();

  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleSubmit = async (productData: ProductFormData) => {
    try {
      const response = await addProduct(productData).unwrap();

      if (response.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <Box bg="bg" minH="100vh" py={{ base: 5, md: 8 }}>
      <Container maxW="1100px">
        <Box mb={6}>
          <Heading fontSize={{ base: "2xl", md: "3xl" }}>
            Add Product
          </Heading>

          <Text mt={1} color="fg.muted">
            Add a new product to your store catalog.
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
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </Box>
      </Container>
    </Box>
  );
};