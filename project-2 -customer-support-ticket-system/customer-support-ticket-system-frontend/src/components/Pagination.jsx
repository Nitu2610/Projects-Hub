import { Button, Box, Text } from "@chakra-ui/react";

export const Pagination = ({
  page,
  totalPages,
  onPrevious,
  onNext,
}) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={{ base: 2, md: 4 }}
      mt={8}
    >
      <Button
        size={{ base: "sm", md: "md" }}
        disabled={page === 1}
        onClick={onPrevious}
      >
        Previous
      </Button>

      <Text
        fontSize={{ base: "sm", md: "md" }}
        color="support.text"
        whiteSpace="nowrap"
      >
        Page {page} of {totalPages}
      </Text>

      <Button
        size={{ base: "sm", md: "md" }}
        disabled={page === totalPages}
        onClick={onNext}
      >
        Next
      </Button>
    </Box>
  );
};