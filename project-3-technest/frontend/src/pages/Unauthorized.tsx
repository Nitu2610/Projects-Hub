import { Box, Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Center minH="100vh" bg="gray.50" px={4}>
      <Box
        w="full"
        maxW="500px"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="xl"
        shadow="lg"
        p={8}
        textAlign="center"
      >
        <Stack gap={5} align="center">
          <Heading size="2xl" color="red.500">
            Access Denied
          </Heading>

          <Text color="gray.600">
            You do not have permission to access this page.
          </Text>

          <Button colorPalette="blue" size="lg" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};
