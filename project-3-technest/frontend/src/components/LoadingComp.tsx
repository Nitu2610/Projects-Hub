import { Center, Spinner } from "@chakra-ui/react";

export const LoadingComp = () => {
  return (
    <Center minH="100vh">
      <Spinner size="xl" />
    </Center>
  );
};