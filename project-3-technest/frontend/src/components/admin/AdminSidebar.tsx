
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import {
  FiBarChart2,
  FiBox,
  FiGrid,
  FiMessageSquare,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: FiBarChart2,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: FiShoppingBag,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: FiBox,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: FiGrid,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: FiUsers,
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: FiMessageSquare,
  },
];

export const AdminSidebar = () => {
  return (
    <Box h="100%" px={4} py={6}>
      {/* Brand */}
      <Box px={3} mb={8}>
        <Heading size="md" color="gray.800">
          TECHNEST
        </Heading>

        <Text fontSize="sm" color="gray.500" mt={1}>
          Admin Panel
        </Text>
      </Box>

      {/* Navigation */}
      <VStack align="stretch" gap={2}>
        {adminNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.path} to={item.path} end={item.path === "/admin/dashboard"}>
              {({ isActive }) => (
                <Flex
                  align="center"
                  gap={3}
                  px={3}
                  py={3}
                  borderRadius="lg"
                  fontSize="sm"
                  fontWeight={isActive ? "semibold" : "medium"}
                  color={isActive ? "gray.800" : "gray.600"}
                  bg={isActive ? "gray.100" : "transparent"}
                  _hover={{
                    bg: "gray.100",
                    color: "gray.800",
                  }}
                  transition="all 0.2s"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    color={isActive ? "gray.800" : "gray.500"}
                  >
                    <Icon size={18} />
                  </Box>

                  <Text>{item.label}</Text>
                </Flex>
              )}
            </NavLink>
          );
        })}
      </VStack>
    </Box>
  );
};

