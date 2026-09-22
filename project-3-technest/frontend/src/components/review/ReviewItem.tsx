import {
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { Review } from "../../redux/api/reviewApi";

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem = ({
  review,
}: ReviewItemProps) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      mb={4}
    >
      <Heading size="sm">
        {review.user.fullName}
      </Heading>

      <Text
        mt={2}
        fontWeight="bold"
      >
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </Text>

      <Text mt={2}>
        {review.comment}
      </Text>

      <Text
        mt={2}
        fontSize="sm"
        color="gray.500"
      >
        {new Date(
          review.createdAt,
        ).toLocaleDateString()}
      </Text>
    </Box>
  );
};