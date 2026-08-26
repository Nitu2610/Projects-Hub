import { Center, Heading, Text, VStack } from "@chakra-ui/react";

export const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display.",
}) => {
  return (
    <Center
      py={{ base: 10, md: 14 }}
      px={4}
      textAlign="center"
    >
      <VStack gap={2}>
        <Heading
          size={{ base: "md", md: "lg" }}
          color="support.text"
        >
          {title}
        </Heading>

        <Text
          color="support.muted"
          fontSize={{ base: "sm", md: "md" }}
          maxW="420px"
        >
          {message}
        </Text>
      </VStack>
    </Center>
  );
};