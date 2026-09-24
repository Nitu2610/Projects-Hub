import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { CustomerTable } from "./CustomerTable";
import { useGetCustomersQuery } from "../../../redux/api/userApi";


export const AdminCustomers = () => {
  const { data, isLoading, isError } = useGetCustomersQuery();

  if (isLoading) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={3}>
          <Spinner size="lg" />
          <Text color="gray.500">
            Loading customers...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (isError || !data?.data) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={2}>
          <Heading size="md">
            Unable to load customers
          </Heading>

          <Text color="gray.500">
            Please try refreshing the page.
          </Text>
        </VStack>
      </Flex>
    );
  }

  const customers = data.data;

  return (
    <Box color="black" p={{ base: 4, md: 8 }}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
      >
        <Box>
          <Heading size="lg">
            Customers
          </Heading>

          <Text color="gray.500" mt={1}>
            View registered customers
          </Text>
        </Box>

        <Text color="gray.500">
          Total: {customers.length}
        </Text>
      </Flex>

      {customers.length === 0 ? (
        <Flex
          minH="250px"
          align="center"
          justify="center"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <Text color="gray.500">
            No customers available.
          </Text>
        </Flex>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </Box>
  );
};