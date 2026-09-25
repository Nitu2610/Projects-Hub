import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../api/productApi";
import { AdminProductTable } from "../../components/admin/AdminProductTable";

export const AdminProducts = () => {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetProductsQuery({ limit: 30 });

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
        <Text mt={3}>Loading products...</Text>
      </Box>
    );
  }

  if (isError || !response?.data) {
    return (
      <Box p={6}>
        <Heading size="md">Unable to load products</Heading>
        <Text mt={2}>Something went wrong while loading products.</Text>
      </Box>
    );
  }

 const products = response.data.products;

  return (
    <Box p={6}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Heading size="lg">Products</Heading>

        <Button onClick={() => navigate("/admin/add-product")}>
          Add Product
        </Button>
      </Box>

      {products.length === 0 ? (
        <Text>No products found.</Text>
      ) : (
        <AdminProductTable products={products} />
      )}
    </Box>
  );
};
