import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Center minH="calc(100vh - 80px)" bg="bg" px={4}>
      <Box
        w="full"
        maxW="500px"
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        p={{ base: 6, md: 8 }}
        textAlign="center"
      >
        <Stack gap={5} align="center">
          <Heading
            size="2xl"
            color="error"
          >
            Access Denied
          </Heading>

          <Text color="fg.muted">
            You do not have permission to access this page.
          </Text>

          <Button
            colorPalette="blue"
            size="lg"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};