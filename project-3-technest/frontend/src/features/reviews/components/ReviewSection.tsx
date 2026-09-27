import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetUserProfileQuery } from "../../customers/api/customerApi";
import { useGetProductReviewsQuery } from "../api/reviewApi";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const navigate = useNavigate();

  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: profileData } = useGetUserProfileQuery();

  const {
    data,
    isLoading,
    isError,
  } = useGetProductReviewsQuery(productId);

  const isAuthenticated = !!profileData?.data;

  if (isLoading) {
    return (
      <Box>
        <Heading size="lg">Customer Reviews</Heading>
        <Text mt={4} color="fg.muted">
          Loading reviews...
        </Text>
      </Box>
    );
  }

  if (isError || !data?.data) {
    return (
      <Box>
        <Heading size="lg">Customer Reviews</Heading>
        <Text mt={4} color="fg.muted">
          Unable to load reviews.
        </Text>
      </Box>
    );
  }

  const {
    reviews,
    averageRating,
    reviewCount,
    canReview,
  } = data.data;

  return (
    <Box>
      <Heading size="lg">Customer Reviews</Heading>

      <Box mt={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {averageRating.toFixed(1)} / 5
        </Text>

        <Text color="fg.muted">
          {reviewCount}{" "}
          {reviewCount === 1 ? "review" : "reviews"}
        </Text>
      </Box>

      <Box mt={6}>
        {!isAuthenticated ? (
          <Stack
            gap={3}
            p={5}
            borderWidth="1px"
            borderColor="border"
            borderRadius="lg"
            bg="bg.panel"
          >
            <Text fontWeight="600">
              Want to share your experience?
            </Text>

            <Text color="fg.muted">
              Please log in to write a review.
            </Text>

            <Button
              width={{ base: "100%", sm: "fit-content" }}
              onClick={() => navigate("/login")}
            >
              Login to Review
            </Button>
          </Stack>
        ) : canReview ? (
          <Box
            p={5}
            borderWidth="1px"
            borderColor="border"
            borderRadius="lg"
            bg="bg.panel"
          >
            {!showReviewForm ? (
              <Stack gap={3}>
                <Text fontWeight="600">
                  Purchased this product?
                </Text>

                <Text color="fg.muted">
                  Share your experience with other customers.
                </Text>

                <Button
                  width={{ base: "100%", sm: "fit-content" }}
                  alignSelf={{ base: "stretch", sm: "flex-start" }}
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </Button>
              </Stack>
            ) : (
              <Stack gap={5}>
                <Box>
                  <Heading size="md">
                    Write a Review
                  </Heading>

                  <Text mt={1} color="fg.muted" fontSize="sm">
                    Share your experience with this product.
                  </Text>
                </Box>

                <ReviewForm productId={productId} />

                <Button
                  variant="outline"
                  width={{ base: "100%", sm: "fit-content" }}
                  alignSelf={{ base: "stretch", sm: "flex-start" }}
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Box>
        ) : (
          <Box
            p={5}
            borderWidth="1px"
            borderColor="border"
            borderRadius="lg"
            bg="bg.muted"
          >
            <Text fontWeight="600">
              Review unavailable
            </Text>

            <Text mt={1} color="fg.muted">
              You can write a review after receiving this product.
            </Text>
          </Box>
        )}
      </Box>

      <Box mt={10}>
        <ReviewList reviews={reviews} />
      </Box>
    </Box>
  );
};