import { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { ReviewTable } from "../components/ReviewTable";
import { useGetAllReviewsQuery } from "../api/reviewApi";
import { LoadingComp } from "../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../components/shared/ErrorComp";
import { Pagination } from "../../../components/shared/Pagination";

export const AdminReviews = () => {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useGetAllReviewsQuery({
    page,
    limit: 10,
  });

  if (isLoading) return <LoadingComp />;

  if (isError || !data?.data) {
    return (
      <ErrorComp message="Unable to load reviews. Please try again." />
    );
  }

  const { reviews, pagination } = data.data;

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
              Reviews
            </Heading>

            <Text mt={1} color="fg.muted">
              View customer product reviews.
            </Text>
          </Box>

          <Text fontSize="sm" color="fg.muted" fontWeight="medium">
            Total: {pagination.total}
          </Text>
        </Flex>

        {reviews.length === 0 ? (
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            textAlign="center"
          >
            <Heading size="md">No reviews available</Heading>

            <Text mt={2} color="fg.muted">
              Customer product reviews will appear here.
            </Text>
          </Box>
        ) : (
          <>
            <ReviewTable reviews={reviews} />

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