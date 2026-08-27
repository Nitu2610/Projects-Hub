import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Heading, Text } from "@chakra-ui/react";

export const TicketByAgentChart = ({ data }) => {
  // Sort a copied array so the original API data remains unchanged.
  const sortedData = [...data].sort(
    (a, b) => a.ticketCount - b.ticketCount,
  );

  return (
    <Box
      bg="support.surface"
      border="1px solid"
      borderColor="support.border"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
    >
      <Box mb={5}>
        <Heading
          size={{ base: "md", md: "lg" }}
          color="support.text"
        >
          Agent Workload
        </Heading>

        <Text
          mt={1}
          fontSize="sm"
          color="support.muted"
        >
          Number of tickets currently assigned to each agent.
        </Text>
      </Box>

      <Box
        w="100%"
        h={{ base: "280px", md: "350px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chakra-colors-support-border)"
            />

            <XAxis
              dataKey="agentName"
              tick={{
                fill: "var(--chakra-colors-support-muted)",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fill: "var(--chakra-colors-support-muted)",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="ticketCount"
              fill="var(--chakra-colors-blue-500)"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};