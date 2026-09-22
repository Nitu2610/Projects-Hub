import { Box, Text } from "@chakra-ui/react";
import type { Review } from "../../redux/api/reviewApi";
import { ReviewItem } from "./ReviewItem";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({
  reviews,
}: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <Text color="gray.500">
        No reviews yet. Be the first to review this product.
      </Text>
    );
  }

  return (
    <Box>
      {reviews.map(review => (
        <ReviewItem
          key={review._id}
          review={review}
        />
      ))}
    </Box>
  );
};