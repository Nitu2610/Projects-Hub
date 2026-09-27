import { Button, HStack } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <HStack
      justify="center"
      gap={2}
      mt={8}
      width="100%"
    >
      <Button
        size={{ base: "sm", md: "md" }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Go to previous page"
      >
        Previous
      </Button>

      <Button
        size={{ base: "sm", md: "md" }}
        variant="outline"
        disabled
        aria-label={`Page ${currentPage} of ${totalPages}`}
      >
        {currentPage} / {totalPages}
      </Button>

      <Button
        size={{ base: "sm", md: "md" }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Go to next page"
      >
        Next
      </Button>
    </HStack>
  );
};
