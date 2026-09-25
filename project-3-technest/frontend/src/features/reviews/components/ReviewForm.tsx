import {
  Button,
  Field,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCreateReviewMutation } from "../api/reviewApi";


interface ReviewFormProps {
  productId: string;
}

export const ReviewForm = ({ productId }: ReviewFormProps) => {
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setErrorMessage("Comment is required.");
      return;
    }

    if (trimmedComment.length < 10) {
      setErrorMessage("Comment must be at least 10 characters.");
      return;
    }

    try {
      await createReview({
        productId,
        rating: Number(rating),
        comment: trimmedComment,
      }).unwrap();

      setRating("5");
      setComment("");
    } catch (error) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const data = error.data;

        if (
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
        ) {
          setErrorMessage(data.message);
          return;
        }
      }

      setErrorMessage("Unable to submit your review. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Field.Root>
          <Field.Label>Rating</Field.Label>

          <NativeSelect.Root>
            <NativeSelect.Field
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Very Poor</option>
            </NativeSelect.Field>

            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label>Comment</Field.Label>

          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience with this product..."
            rows={5}
          />
        </Field.Root>

        {errorMessage && <Text color="red.500">{errorMessage}</Text>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </Stack>
    </form>
  );
};
