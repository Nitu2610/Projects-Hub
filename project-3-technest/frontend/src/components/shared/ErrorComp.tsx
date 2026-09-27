import { Box, Heading, Text } from "@chakra-ui/react";

interface ErrorCompProps {
  status?: number;
  message?: string;
}

export const ErrorComp = ({
  status,
  message = "Something went wrong. Please try again.",
}: ErrorCompProps) => {
  return (
    <Box
      maxW="1200px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={12}
      textAlign="center"
    >
      <Heading size="md">
        {status ? `Error ${status}` : "Something went wrong"}
      </Heading>

      <Text mt={3} color="fg.muted">
        {message}
      </Text>
    </Box>
  );
};
