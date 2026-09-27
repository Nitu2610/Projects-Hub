import { Badge, Box, Table, Text } from "@chakra-ui/react";
import { Review } from "../../../types/review.types";

interface ReviewTableProps {
  reviews: Review[];
}

export const ReviewTable = ({
  reviews,
}: ReviewTableProps) => {
  return (
    <Box
      overflowX="auto"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
    >
      <Table.Root
        variant="outline"
        minW="1050px"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              Customer
            </Table.ColumnHeader>

            <Table.ColumnHeader>
              Product
            </Table.ColumnHeader>

            <Table.ColumnHeader textAlign="center">
              Rating
            </Table.ColumnHeader>

            <Table.ColumnHeader>
              Comment
            </Table.ColumnHeader>

            <Table.ColumnHeader textAlign="center">
              Date
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {reviews.map((review) => (
            <Table.Row key={review._id}>
              <Table.Cell>
                <Text fontWeight="medium">
                  {review.user.fullName}
                </Text>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                  truncate
                  maxW="220px"
                >
                  {review.user.email}
                </Text>
              </Table.Cell>

              <Table.Cell maxW="250px">
                <Text truncate>
                  {review.product.title}
                </Text>
              </Table.Cell>

              <Table.Cell textAlign="center">
                <Badge
                  colorPalette={
                    review.rating >= 4
                      ? "green"
                      : review.rating >= 3
                        ? "yellow"
                        : "red"
                  }
                  variant="subtle"
                >
                  {review.rating}/5
                </Badge>
              </Table.Cell>

              <Table.Cell maxW="350px">
                <Text
                  whiteSpace="normal"
                  color="fg"
                >
                  {review.comment}
                </Text>
              </Table.Cell>

              <Table.Cell textAlign="center">
                {new Date(
                  review.createdAt
                ).toLocaleDateString("en-IN", {
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