import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";

import { useGetAdminDashboardStatsQuery } from "../api/adminDashboardApi";
import { StatCard } from "../components/StatCard";
import { SalesOverview } from "../components/SalesOverview";
import { OrderStatus } from "../components/OrderStatus";
import { InventoryOverview } from "../components/InventoryOverview";
import { RecentOrders } from "../components/RecentOrders";

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
          <Text color="fg.muted">Loading dashboard...</Text>
        </VStack>
      </Flex>
    );
  }

  if (isError || !statsData?.data) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={2}>
          <Heading size="md">Unable to load dashboard</Heading>
          <Text color="fg.muted">Please try refreshing the dashboard.</Text>
        </VStack>
      </Flex>
    );
  }

  const stats = statsData.data;

  return (
    <Box bg="bg" minH="100vh" py={{ base: 5, md: 8 }}>
      <Container maxW="1400px">
        <Flex
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={8}
        >
          <Box>
            <Heading size="lg">Dashboard</Heading>

            <Text mt={1} color="fg.muted">
              Overview of your store performance
            </Text>
          </Box>

          <IconButton
            aria-label="Refresh dashboard"
            onClick={() => refetch()}
            loading={isFetching}
            variant="outline"
            bg="bg.panel"
            borderColor="border"
          >
            <FiRefreshCw />
          </IconButton>
        </Flex>

        <SimpleGrid 
        columns={{ base: 1, md: 2, lg: 4 }} 
        gap={5} 
        mb={6}
        textAlign={{base:"center",md:"center",lg:"left"}}
        >
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

        <SimpleGrid columns={{ base: 1, xl: 3 }} gap={6} mb={6}>
          <Box gridColumn={{ xl: "span 2" }}>
            <SalesOverview data={stats.salesOverview} />
          </Box>

          <OrderStatus data={stats.orderStatusStats} />
        </SimpleGrid>

        <Box mb={6}>
          <InventoryOverview data={stats.inventoryStats} />
        </Box>

        <RecentOrders orders={stats.recentOrders} />
      </Container>
    </Box>
  );
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
