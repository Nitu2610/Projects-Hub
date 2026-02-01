import { Box, Heading, Text, Container } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box
      bg="lightcoral"
      borderTop="1px solid black"
      py={8}
      mt={10}
      w="100%"
      marginTop={20}
    >
      <Container maxW="80%" textAlign="center" >
        <Heading size="md" mb={3}>
          I am Footer
        </Heading>

        <Text fontSize="sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam harum
          et ab quaerat, molestias odio nemo quidem quasi quae iusto eligendi
          minima culpa explicabo recusandae assumenda quam nulla enim itaque.
        </Text>
      </Container>
    </Box>
  );
};
