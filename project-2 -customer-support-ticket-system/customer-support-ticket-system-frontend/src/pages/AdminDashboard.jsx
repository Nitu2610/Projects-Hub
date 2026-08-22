import { Box, Container, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ticketApi } from "../api/ticketApi";
import { DashboardCard } from "../components/DashboardCard";
import { AgentTicketSummary } from "../components/AgentTicketSummary";
import { TicketByAgentChart } from "../components/TicketByAgentChart";
import { LogoutButton } from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";

// AdminDashboard:
// Loads aggregated ticket statistics and passess the data to
// smaller components responsible for displaying each dashboard.

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate=useNavigate();

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

  if (loading) return <Heading>Loading...</Heading>;
  if (error) return <Heading>{error} </Heading>;

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
    <>
    <LogoutButton/>
      <Container maxW="container.xl" py={8}>
        <Heading mb={6}> Admin Dashboard </Heading>

        <DashboardCard label="Total Tickets" value={stats.totalTickets} onClick={()=> navigate('/tickets')} />

        <Box borderWidth="1px" borderRadius="md" p={5} mt={6}>
          <Heading size="md" mb={4}>
            Tickets by Status
          </Heading>

          <DashboardCard
            label=" Open Tickets "
            value={getStatusCount("Open")}
          />

          <DashboardCard
            label=" In Progress Tickets "
            value={getStatusCount("In Progress")}
          />

          <DashboardCard
            label=" Resolved Tickets "
            value={getStatusCount("Resolved")}
          />

          <DashboardCard
            label=" Closed Tickets "
            value={getStatusCount("Closed")}
          />
        </Box>

        <Box borderWidth="1px" borderRadius="md" p={5} mt={6}>
          <Heading size="md" mb={4}>
            Tickets by Priority
          </Heading>

          <DashboardCard
            label=" Low Priority "
            value={getPriorityCount("Low")}
          />

          <DashboardCard
            label=" Medium Priority "
            value={getPriorityCount("Medium")}
          />

          <DashboardCard
            label=" High Priority "
            value={getPriorityCount("High")}
          />

          <DashboardCard
            label=" Critical Priority "
            value={getPriorityCount("Critical")}
          />
        </Box>

        <AgentTicketSummary agents={stats.ticketsByAgent} />
      </Container>

      <Container>
        <TicketByAgentChart data={stats.ticketsByAgent} />
      </Container>
    </>
  );
};
