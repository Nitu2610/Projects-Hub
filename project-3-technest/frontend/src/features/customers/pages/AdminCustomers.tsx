import { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { CustomerTable } from "../components/CustomerTable";
import { useGetCustomersQuery } from "../api/customerApi";
import { LoadingComp } from "../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../components/shared/ErrorComp";
import { Pagination } from "../../../components/shared/Pagination";

export const AdminCustomers = () => {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useGetCustomersQuery({
    page,
    limit: 10,
  });

  if (isLoading) return <LoadingComp />;

  if (isError || !data?.data) {
    return (
      <ErrorComp message="Unable to load customers. Please try again." />
    );
  }

  const { customers, pagination } = data.data;

  return (
    <Box bg="bg" minH="100vh" py={{ base: 5, md: 8 }}>
      <Container maxW="1400px">
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap={3}
          mb={6}
        >
          <Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>
              Customers
            </Heading>

            <Text mt={1} color="fg.muted">
              View registered customers.
            </Text>
          </Box>

          <Text fontSize="sm" color="fg.muted" fontWeight="medium">
            Total: {pagination.total}
          </Text>
        </Flex>

        {customers.length === 0 ? (
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            textAlign="center"
          >
            <Heading size="md">No customers available</Heading>

            <Text mt={2} color="fg.muted">
              Registered customers will appear here.
            </Text>
          </Box>
        ) : (
          <>
            <CustomerTable customers={customers} />

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