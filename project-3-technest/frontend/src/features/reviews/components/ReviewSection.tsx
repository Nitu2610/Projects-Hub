import { Box, Heading, Text } from "@chakra-ui/react";

import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { useGetProductReviewsQuery } from "../api/reviewApi";

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { data, isLoading, isError } = useGetProductReviewsQuery(productId);

  if (isLoading) {
    return (
      <Box>
        <Heading size="lg">Customer Reviews</Heading>

        <Text mt={4}>Loading reviews...</Text>
      </Box>
    );
  }

  if (isError || !data?.data) {
    return (
      <Box>
        <Heading size="lg">Customer Reviews</Heading>

        <Text mt={4}>Unable to load reviews.</Text>
      </Box>
    );
  }

  const { reviews, averageRating, reviewCount, canReview } = data.data;

  return (
    <Box>
      <Heading size="lg">Customer Reviews</Heading>

      <Box mt={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {averageRating.toFixed(1)} / 5
        </Text>

        <Text color="gray.500">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </Text>
      </Box>

      {canReview && (
        <Box mt={6}>
          <Heading size="md" mb={4}>
            Write a Review
          </Heading>

          <ReviewForm productId={productId} />
        </Box>
      )}

      <Box mt={8}>
        <ReviewList reviews={reviews} />
      </Box>
    </Box>
  );
};
