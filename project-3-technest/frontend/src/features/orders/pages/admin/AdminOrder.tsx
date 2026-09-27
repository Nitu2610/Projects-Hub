import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
} from "@chakra-ui/react";

import { AdminOrderTable } from "../../components/admin/AdminOrderTable";
import { LoadingComp } from "../../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../../components/shared/ErrorComp";
import { Pagination } from "../../../../components/shared/Pagination";
import { useGetAdminOrdersQuery } from "../../api/adminOrderApi";

export const AdminOrders = () => {
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAdminOrdersQuery({
    page,
    limit: 10,
  });

  if (isLoading) return <LoadingComp />;

  if (isError || !response?.data) {
    return (
      <ErrorComp message="Unable to load orders. Please try again." />
    );
  }

  const { orders, pagination } = response.data;
  return (
    <Box
      bg="bg"
      minH="100vh"
      py={{ base: 5, md: 8 }}
    >
      <Container maxW="1400px">
        <Box mb={6}>
          <Heading fontSize={{ base: "2xl", md: "3xl" }}>
            Orders
          </Heading>

          <Text mt={1} color="fg.muted">
            Manage and monitor customer orders.
          </Text>
        </Box>

        {orders.length === 0 ? (
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            textAlign="center"
          >
            <Heading size="md">
              No orders found.
            </Heading>

            <Text mt={2} color="fg.muted">
              Customer orders will appear here after purchases are made.
            </Text>
          </Box>
        ) : (
          <>
            <AdminOrderTable orders={orders} />

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