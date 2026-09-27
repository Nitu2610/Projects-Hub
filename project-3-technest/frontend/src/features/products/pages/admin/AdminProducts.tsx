import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useGetProductsQuery } from "../../api/productApi";
import { AdminProductTable } from "../../components/admin/AdminProductTable";
import { LoadingComp } from "../../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../../components/shared/ErrorComp";
import { Pagination } from "../../../../components/shared/Pagination";
import { useState } from "react";

export const AdminProducts = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetProductsQuery({
    page,
    limit: 10,
  });

  if (isLoading) return <LoadingComp />;

  if (isError || !response?.data) {
    return (
      <ErrorComp message="Unable to load products. Please try again." />
    );
  }

  const { products, pagination } = response.data;

  return (
    <Box
      bg="bg"
      minH="100vh"
      py={{ base: 5, md: 8 }}
    >
      <Container maxW="1400px">
        <Box
          display="flex"
          flexDirection={{ base: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "stretch", sm: "center" }}
          gap={4}
          mb={6}
        >
          <Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>
              Products
            </Heading>

            <Text mt={1} color="fg.muted">
              Manage your store products.
            </Text>
          </Box>

          <Button
            width={{ base: "100%", sm: "auto" }}
            onClick={() => navigate("/admin/add-product")}
          >
            Add Product
          </Button>
        </Box>

        {products.length === 0 ? (
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            textAlign="center"
          >
            <Heading size="md">
              No products found.
            </Heading>

            <Text mt={2} color="fg.muted">
              Add a product to start building your catalog.
            </Text>
          </Box>
        ) : (
          <>
            <AdminProductTable products={products} />

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </Container>
    </Box>
  );
};