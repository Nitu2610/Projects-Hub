import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useGetAdminDashboardStatsQuery } from "../redux/api/adminDashboardApi";



export const AdminDashboard = () => {
  const { data:statsData, isLoading, isError } =
    useGetAdminDashboardStatsQuery();



  if (isLoading) {
    return <Text>Loading dashboard...</Text>;
  }

  if (isError) {
    return <Text>Failed to load dashboard.</Text>;
  }

  const stats = statsData?.data[0];

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Box>
          <Text>Total Revenue</Text>
          <Text fontSize="2xl" fontWeight="bold">
            ₹{stats?.totalRevenue ?? 0}
          </Text>
        </Box>

        <Box>
          <Text>Total Orders</Text>
          <Text fontSize="2xl" fontWeight="bold">
            {stats?.totalOrders ?? 0}
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

