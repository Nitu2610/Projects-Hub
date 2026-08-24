import { Center, Heading, Text, VStack } from "@chakra-ui/react";

export const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display.",
}) => {
  return (
    <Center py={10}>
      <VStack gap={2}>
        <Heading size="md"> {title}</Heading>
        <Text color="gray.500"> {message}</Text>
      </VStack>
    </Center>
  );
};
