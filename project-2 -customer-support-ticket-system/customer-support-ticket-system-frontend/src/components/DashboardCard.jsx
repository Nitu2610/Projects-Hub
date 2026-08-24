import { Box, Heading, Text } from "@chakra-ui/react";

// DashboardCard:
// Displays a single dashboard metric using a label and value.
// It contains no business logic and only controls presentations.

export const DashboardCard = ({ label, value, onClick }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={5} onClick={onClick} cursor="pointer">
      <Text> {label} </Text>
      <Heading size="2xl"> {value} </Heading>
    </Box>
  );
};
