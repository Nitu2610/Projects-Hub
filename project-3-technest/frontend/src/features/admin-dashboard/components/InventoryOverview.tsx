import { Box, Heading, SimpleGrid, Text, VStack, Flex } from "@chakra-ui/react";
import {
  FiAlertCircle,
  FiArchive,
  FiCheckCircle,
  FiPackage,
} from "react-icons/fi";

interface InventoryOverviewProps {
  data: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };
}

const inventoryItems = [
  {
    key: "totalProducts",
    title: "Total Products",
    icon: FiPackage,
  },
  {
    key: "activeProducts",
    title: "Active Products",
    icon: FiCheckCircle,
  },
  {
    key: "lowStockProducts",
    title: "Low Stock",
    icon: FiAlertCircle,
  },
  {
    key: "outOfStockProducts",
    title: "Out of Stock",
    icon: FiArchive,
  },
] as const;

export const InventoryOverview = ({ data }: InventoryOverviewProps) => {
  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      p={5}
    >
      <Box mb={5}>
        <Heading size="md">Inventory Health</Heading>

        <Text fontSize="sm" color="fg.muted" mt={1}>
          Current product and stock overview
        </Text>
      </Box>

   <SimpleGrid
  columns={{ base: 1, md: 2, lg: 4 }}
  gap={4}
  mb={6}
>
  {inventoryItems.map((item) => {
    const Icon = item.icon;
    const value = data[item.key];

    const isWarning =
      item.key === "lowStockProducts" ||
      item.key === "outOfStockProducts";

    return (
    <Box
  key={item.key}
  borderWidth="1px"
  borderColor="border"
  borderRadius="lg"
  p={4}
  bg={isWarning ? "bg.muted" : "bg.panel"}
>
  <VStack
    align="center"
    justify="center"
    gap={3}
    textAlign="center"
    w="full"
  >
    <Box
      p={2.5}
      borderRadius="lg"
      bg="bg.muted"
      color={isWarning ? "warning" : "fg.muted"}
    >
      <Icon size={20} />
    </Box>

    <Box>
      <Text
        fontSize="sm"
        color="fg.muted"
        mb={1}
      >
        {item.title}
      </Text>

      <Text
        fontSize="2xl"
        fontWeight="bold"
      >
        {value}
      </Text>
    </Box>
  </VStack>
</Box>
    );
  })}
</SimpleGrid>
    </Box>
  );
};
