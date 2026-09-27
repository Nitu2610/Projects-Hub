import { Box, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      p={5}
    >
      <Flex direction="column" gap={2}>
        {icon && (
          <Box fontSize="xl" color="primary">
            {icon}
          </Box>
        )}

        <Text fontSize="sm" fontWeight="medium" color="fg.muted">
          {title}
        </Text>

        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
        >
          {value}
        </Text>

        {description && (
          <Text fontSize="xs" color="fg.muted">
            {description}
          </Text>
        )}
      </Flex>
    </Box>
  );
};