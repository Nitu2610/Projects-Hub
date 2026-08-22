import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

// Display a fallback page when the requested route does not exist.
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <VStack>
      <Heading>404 - Page Not Found </Heading>
      <Text> The page you are looking for does'nt exist.</Text>
      <Button onClick={() => navigate("/")}> Go back </Button>
    </VStack>
  );
};
