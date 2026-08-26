import { Box, Heading, Text, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ticketApi } from "../api/ticketApi";
import { DashboardCard } from "../components/DashboardCard";
import { AgentTicketSummary } from "../components/AgentTicketSummary";
import { TicketByAgentChart } from "../components/TicketByAgentChart";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";

// AdminDashboard:
// Loads aggregated ticket statistics and passess the data to
// smaller components responsible for displaying each dashboard.

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetched all dashboard statistics from the backend.
  // The API layer keeps request logic outside the dashboard component.
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await ticketApi.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch the stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  // Helper function to count the ticket count with respective to status.
  const getStatusCount = (status) => {
    const ticketStatus = stats.ticketsByStatus.find(
      (item) => item.status === status,
    );
    return ticketStatus ? ticketStatus.ticketCount : 0;
  };

  // Helper function to count the ticket count with respective to priority.
  const getPriorityCount = (priority) => {
    const ticketPriority = stats.ticketsByPriority.find(
      (item) => item.priority === priority,
    );
    return ticketPriority ? ticketPriority.ticketCount : 0;
  };

  return (
    <Box
      minH="calc(100vh - 64px)"
      bg="support.background"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="1200px">
        {/* Header */}
        <Box mb={{ base: 6, md: 8 }}>
          <Heading size={{ base: "xl", md: "2xl" }} color="support.text">
            Admin Dashboard
          </Heading>

          <Text
            mt={2}
            color="support.muted"
            fontSize={{ base: "sm", md: "md" }}
          >
            Monitor support activity and ticket performance.
          </Text>
        </Box>

        {/* Total tickets */}
        <Box mb={{ base: 6, md: 8 }} maxW={{ base: "100%", md: "280px" }}>
          <DashboardCard
            label="Total Tickets"
            value={stats.totalTickets}
            onClick={() => navigate("/tickets")}
            colorPalette="blue"
          />
        </Box>

        {/* Status */}
        <Box mb={{ base: 8, md: 10 }}>
          <Heading size={{ base: "md", md: "lg" }} color="support.text" mb={4}>
            Tickets by Status
          </Heading>

          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
          >
            <DashboardCard
              label="Open Tickets"
              value={getStatusCount("Open")}
              colorPalette="blue"
            />

            <DashboardCard
              label="In Progress Tickets"
              value={getStatusCount("In Progress")}
              colorPalette="orange"
            />

            <DashboardCard
              label="Resolved Tickets"
              value={getStatusCount("Resolved")}
              colorPalette="green"
            />

            <DashboardCard
              label="Closed Tickets"
              value={getStatusCount("Closed")}
              colorPalette="gray"
            />
          </Box>
        </Box>

        {/* Priority */}
        <Box mb={{ base: 8, md: 10 }}>
          <Heading size={{ base: "md", md: "lg" }} color="support.text" mb={4}>
            Tickets by Priority
          </Heading>

          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
          >
            <DashboardCard
              label="Low Priority"
              value={getPriorityCount("Low")}
              colorPalette="green"
            />

            <DashboardCard
              label="Medium Priority"
              value={getPriorityCount("Medium")}
              colorPalette="yellow"
            />

            <DashboardCard
              label="High Priority"
              value={getPriorityCount("High")}
              colorPalette="orange"
            />

            <DashboardCard
              label="Critical Priority"
              value={getPriorityCount("Critical")}
              colorPalette="red"
            />
          </Box>
        </Box>

        {/* Agent summary */}
        <Box mb={{ base: 8, md: 10 }}>
          <AgentTicketSummary agents={stats.ticketsByAgent} />
        </Box>

        {/* Chart */}
        <Box
          bg="support.surface"
          border="1px solid"
          borderColor="support.border"
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
        >
          <Heading size={{ base: "md", md: "lg" }} color="support.text" mb={5}>
            Ticket Distribution by Agent
          </Heading>

          <TicketByAgentChart data={stats.ticketsByAgent} />
        </Box>
      </Container>
    </Box>
  );
};
