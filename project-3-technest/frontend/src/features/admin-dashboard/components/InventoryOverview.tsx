
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
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

export const InventoryOverview = ({
  data,
}: InventoryOverviewProps) => {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={5}
      boxShadow="sm"
    >
      <Box mb={5}>
        <Heading size="md" color="gray.800">
          Inventory Health
        </Heading>

        <Text fontSize="sm" color="gray.500" mt={1}>
          Current product and stock overview
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
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
              borderColor="gray.100"
              borderRadius="lg"
              p={4}
              bg={isWarning ? "gray.50" : "white"}
            >
              <VStack align="flex-start" gap={3}>
                <Box
                  p={2.5}
                  borderRadius="lg"
                  bg="gray.100"
                  color="gray.600"
                >
                  <Icon size={20} />
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    mb={1}
                  >
                    {item.title}
                  </Text>

                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="gray.800"
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
