
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

interface OrderStatusProps {
  data: {
    PLACED: number;
    CONFIRMED: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
  };
}

const statusConfig = [
  {
    key: "PLACED",
    label: "Placed",
    icon: FiClock,
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    icon: FiCheckCircle,
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: FiTruck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: FiPackage,
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    icon: FiXCircle,
  },
] as const;

export const OrderStatus = ({ data }: OrderStatusProps) => {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={5}
      boxShadow="sm"
      h="100%"
    >
      <Box mb={5}>
        <Heading size="md" color="gray.800">
          Order Status
        </Heading>

        <Text fontSize="sm" color="gray.500" mt={1}>
          Current order distribution
        </Text>
      </Box>

      <VStack align="stretch" gap={3}>
        {statusConfig.map((status) => {
          const Icon = status.icon;
          const value = data[status.key];

          return (
            <HStack
              key={status.key}
              justify="space-between"
              p={3}
              borderRadius="lg"
              bg="gray.50"
            >
              <HStack gap={3}>
                <Box
                  p={2}
                  borderRadius="md"
                  bg="white"
                  color="gray.600"
                >
                  <Icon size={18} />
                </Box>

                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                >
                  {status.label}
                </Text>
              </HStack>

              <Text
                fontSize="lg"
                fontWeight="bold"
                color="gray.800"
              >
                {value}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};