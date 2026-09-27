
import { Box, Grid, Text } from "@chakra-ui/react";

interface ProductSpecificationsProps {
  specification: Record<string, string>;
}

export const ProductSpecifications = ({
  specification,
}: ProductSpecificationsProps) => {
  const entries = Object.entries(specification ?? {});

  if (entries.length === 0) {
    return null;
  }

  return (
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="600" mb={4}>
        Specifications
      </Text>

      <Box
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        overflow="hidden"
        bg="bg.panel"
      >
        {entries.map(([key, value], index) => (
          <Grid
            key={key}
            templateColumns={{ base: "1fr", sm: "180px 1fr" }}
            gap={{ base: 1, sm: 4 }}
            px={4}
            py={3}
            borderTopWidth={index === 0 ? "0" : "1px"}
            borderColor="border"
          >
            <Text fontWeight="600">
              {key}
            </Text>

            <Text color="fg.muted" wordBreak="break-word">
              {value}
            </Text>
          </Grid>
        ))}
      </Box>
    </Box>
  );
};