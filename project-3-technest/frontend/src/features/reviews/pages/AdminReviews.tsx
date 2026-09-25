import { Box, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";


import { ReviewTable } from "../components/ReviewTable";
import { useGetAllReviewsQuery } from "../api/reviewApi";

export const AdminReviews = () => {
  const { data, isLoading, isError } = useGetAllReviewsQuery();

  if (isLoading) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={3}>
          <Spinner size="lg" />

          <Text color="gray.500">Loading reviews...</Text>
        </VStack>
      </Flex>
    );
  }

  if (isError || !data?.data) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={2}>
          <Heading size="md">Unable to load reviews</Heading>

          <Text color="gray.500">Please try refreshing the page.</Text>
        </VStack>
      </Flex>
    );
  }

  const reviews = data.data;

  return (
    <Box color="black" p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Reviews</Heading>

          <Text color="gray.500" mt={1}>
            View customer product reviews
          </Text>
        </Box>

        <Text color="gray.500">Total: {reviews.length}</Text>
      </Flex>

      {reviews.length === 0 ? (
        <Flex
          minH="250px"
          align="center"
          justify="center"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <Text color="gray.500">No reviews available.</Text>
        </Flex>
      ) : (
        <ReviewTable reviews={reviews} />
      )}
    </Box>
  );
};
