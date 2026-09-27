import { Box, Heading, Text } from "@chakra-ui/react";

import { Review } from "../../../types/review.types";

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      p={{ base: 4, md: 5 }}
      mb={4}
      bg="bg.panel"
    >
      <Heading size="sm">{review.user.fullName}</Heading>

      <Text mt={2} fontWeight="600" letterSpacing="wide">
        {"★".repeat(review.rating)}
        <Text as="span" color="fg.muted">
          {"☆".repeat(5 - review.rating)}
        </Text>
      </Text>

      <Text mt={3} lineHeight="1.7">
        {review.comment}
      </Text>

      <Text
        mt={3}
        fontSize="sm"
        color="fg.muted"
      >
        {new Date(review.createdAt).toLocaleDateString()}
      </Text>
    </Box>
  );
};