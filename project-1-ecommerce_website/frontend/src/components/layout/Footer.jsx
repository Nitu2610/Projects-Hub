import { Box, Heading, Text, Container, Stack } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box
      bg={"gray.900"}
      color={"gray.300"}
      borderColor={"gray.700"}
      borderTop={"1px solid"}
      py={8}
      mt={20}
      w={"100%"}
    >
      <Container maxW={"80%"}>
        <Stack spacing={4} textAlign={"center"}>
          <Heading size={"md"} color={"white"}>
            Ecommerce Store
          </Heading>
          <Text fontSize={"sm"}>
            A demo ecommerce application built using React, Redux Toolkit,
            Chakra UI, and a mock backend with JSON Server.
          </Text>
          <Text fontSize={"xs"} color={"gray.400"}>
            © {new Date().getFullYear()} Ecommerce Store. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};
