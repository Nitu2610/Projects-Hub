
import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
}

export const StatCard = ({
  title,
  value,
  description,
  icon,
}: StatCardProps) => {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={5}
      boxShadow="sm"
    >
      <Flex direction="column" gap={2}>
        {icon && <Box fontSize="xl">{icon}</Box>}

        <Text
          fontSize="sm"
          fontWeight="medium"
          color="gray.500"
        >
          {title}
        </Text>

        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="gray.800"
        >
          {value}
        </Text>

        {description && (
          <Text fontSize="xs" color="gray.400">
            {description}
          </Text>
        )}
      </Flex>
    </Box>
  );
};