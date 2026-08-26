import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <Center
      minH={{ base: "180px", md: "250px" }}
      px={4}
    >
      <VStack gap={3}>
        <Spinner
          size="xl"
          color="blue.500"
          borderWidth="3px"
        />

        <Text
          fontSize="sm"
          color="support.muted"
        >
          Loading...
        </Text>
      </VStack>
    </Center>
  );
};