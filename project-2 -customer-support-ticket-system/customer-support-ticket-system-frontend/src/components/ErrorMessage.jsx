import { Alert } from "@chakra-ui/react";

export const ErrorMessage = ({ message }) => {
  return (
    <Alert.Root
      status="error"
      borderRadius="lg"
      border="1px solid"
      borderColor="red.200"
      bg="red.50"
      color="red.800"
      my={4}
    >
      <Alert.Indicator />

      <Alert.Content>
        <Alert.Title>
          Something went wrong
        </Alert.Title>

        <Alert.Description>
          {message}
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
};