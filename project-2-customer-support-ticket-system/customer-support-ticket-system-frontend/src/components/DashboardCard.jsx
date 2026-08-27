import { Box, Heading, Text } from "@chakra-ui/react";

// DashboardCard:
// Displays a single dashboard metric using a label and value.
// It contains no business logic and only controls presentation.

export const DashboardCard = ({
  label,
  value,
  onClick,
  colorPalette = "blue",
}) => {
  return (
    <Box
      bg="support.surface"
      border="1px solid"
      borderColor="support.border"
      borderLeft="4px solid"
      borderLeftColor={`${colorPalette}.500`}
      borderRadius="lg"
      p={{ base: 4, md: 5 }}
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      transition="all 0.2s ease"
      _hover={
        onClick
          ? {
              transform: "translateY(-2px)",
              shadow: "md",
              borderColor: `${colorPalette}.300`,
            }
          : undefined
      }
    >
      <Text color="support.muted" fontSize="sm" fontWeight="medium" mb={2}>
        {label}
      </Text>

      <Heading size={{ base: "xl", md: "2xl" }} color={`${colorPalette}.600`}>
        {value}
      </Heading>
    </Box>
  );
};
