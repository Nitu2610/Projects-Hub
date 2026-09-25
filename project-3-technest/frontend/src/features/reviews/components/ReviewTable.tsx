import { Box, Table, Text } from "@chakra-ui/react";
import { Review } from "../../../types/review.types";

interface ReviewTableProps {
  reviews: Review[];
}

export const ReviewTable = ({ reviews }: ReviewTableProps) => {
  return (
    <Box overflowX="auto" bg="white" borderWidth="1px" borderRadius="lg">
      <Table.Root variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Customer</Table.ColumnHeader>

            <Table.ColumnHeader>Product</Table.ColumnHeader>

            <Table.ColumnHeader>Rating</Table.ColumnHeader>

            <Table.ColumnHeader>Comment</Table.ColumnHeader>

            <Table.ColumnHeader>Date</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {reviews.map((review) => (
            <Table.Row key={review._id}>
              <Table.Cell color="black">
                <Text fontWeight="medium">{review.user.fullName}</Text>

                <Text fontSize="sm" color="gray.500">
                  {review.user.email}
                </Text>
              </Table.Cell>

              <Table.Cell color="black">{review.product.title}</Table.Cell>

              <Table.Cell color="black">{review.rating}/5</Table.Cell>

              <Table.Cell color="black" maxW="350px" whiteSpace="normal">
                {review.comment}
              </Table.Cell>

              <Table.Cell color="black">
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
