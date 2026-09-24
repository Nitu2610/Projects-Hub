import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";

import { useGetAdminDashboardStatsQuery } from "../../redux/api/adminDashboardApi";

import { StatCard } from "./StatCard";
import { SalesOverview } from "./SalesOverview";
import { OrderStatus } from "./OrderStatus";
import { InventoryOverview } from "./InventoryOverview";
import { RecentOrders } from "./RecentOrders";
import { AdminProducts } from "../product/admin/AdminProducts";

export const AdminDashboard = () => {
  const {
    data: statsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAdminDashboardStatsQuery();

  if (isLoading) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={3}>
          <Spinner size="lg" />
          <Text color="gray.500">Loading dashboard...</Text>
        </VStack>
      </Flex>
    );
  }

  if (isError || !statsData?.data) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={2}>
          <Heading size="md">Unable to load dashboard</Heading>
          <Text color="gray.500">Please try refreshing the dashboard.</Text>
        </VStack>
      </Flex>
    );
  }

  const stats = statsData.data;

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 5, md: 8 }}>
      <Container maxW="container.2xl">
        {/* Header */}
        <Flex
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={8}
        >
          <Box>
            <Heading size="lg" color="gray.800">
              Dashboard
            </Heading>

            <Text mt={1} color="gray.500">
              Overview of your store performance
            </Text>
          </Box>

          <IconButton
            aria-label="Refresh dashboard"
            onClick={() => refetch()}
            loading={isFetching}
            variant="outline"
            bg="white"
          >
            <FiRefreshCw />
          </IconButton>
        </Flex>

        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={5} mb={6}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.overview.totalRevenue)}
            description="Total store revenue"
          />

          <StatCard
            title="Total Orders"
            value={stats.overview.totalOrders}
            description="Orders received"
          />

          <StatCard
            title="Total Customers"
            value={stats.overview.totalCustomers}
            description="Registered customers"
          />

          <StatCard
            title="Average Order Value"
            value={formatCurrency(stats.overview.averageOrderValue)}
            description="Average value per order"
          />
        </SimpleGrid>

        {/* Sales + Order Status */}
        <SimpleGrid columns={{ base: 1, xl: 3 }} gap={6} mb={6}>
          <Box gridColumn={{ xl: "span 2" }}>
            <SalesOverview data={stats.salesOverview} />
          </Box>

          <OrderStatus data={stats.orderStatusStats} />
        </SimpleGrid>

        {/* Inventory */}
        <Box mb={6}>
          <InventoryOverview data={stats.inventoryStats} />
        </Box>

        {/* Recent Orders */}
        <RecentOrders orders={stats.recentOrders} />
      </Container>
      <AdminProducts/>
    </Box>
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};
