import { Box, Text } from "@chakra-ui/react";
import { ReviewItem } from "./ReviewItem";
import { Review } from "../../../types/review.types";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({
  reviews,
}: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <Box
        bg="bg.muted"
        borderWidth="1px"
        borderColor="border"
        borderRadius="lg"
        p={5}
      >
        <Text color="fg.muted">
          No reviews yet. Be the first to review this
          product.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {reviews.map((review) => (
        <ReviewItem
          key={review._id}
          review={review}
        />
      ))}
    </Box>
  );
};