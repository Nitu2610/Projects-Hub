import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Heading } from "@chakra-ui/react";

export const TicketByAgentChart = ({ data }) => {
  // Sort a copied array so the original API data remains unchanged.
  const sortedData = [...data].sort((a, b) => a.ticketCount - b.ticketCount);

  return (
    <Box borderWidth="1px" borderRadius="lg" p={5} mt={6}>
      <Heading size="md" mb={5}>
        Agent Workload
      </Heading>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={sortedData}>
          {" "}
          // Use this array as the chart data."
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="agentName" /> // "Use the agentName property for the
          X-axis."
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="ticketCount" /> // "Use ticketCount as the height of
          each bar."
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
