import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useGetOrdersQuery } from "../api/orderApi";
import { OrderCard } from "../components/OrderCard";
import { LoadingComp } from "../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../components/shared/ErrorComp";

export const Orders = () => {
  const {
    data,
    isLoading,
    isError,
  } = useGetOrdersQuery(undefined);

  if (isLoading) {
    return <LoadingComp />;
  }

  if (isError) {
    return (
      <ErrorComp message="Unable to load your orders. Please try again." />
    );
  }

  const orders = data?.data ?? [];

  return (
    <Box
      bg="bg"
      minH="calc(100vh - 80px)"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="1200px">
        <Stack gap={8}>
          <Box>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              My Orders
            </Heading>

            <Text mt={2} color="fg.muted">
              View and track your recent orders.
            </Text>
          </Box>

          {orders.length === 0 ? (
            <Box
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              bg="bg.panel"
              p={{ base: 6, md: 8 }}
              textAlign="center"
            >
              <Heading size="md">
                You haven't placed any orders yet.
              </Heading>

              <Text mt={3} color="fg.muted">
                Your orders will appear here after you complete a purchase.
              </Text>
            </Box>
          ) : (
            <Stack gap={5}>
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};