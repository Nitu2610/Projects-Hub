import { Box, Heading, Text } from "@chakra-ui/react";

// AgentTicketSummary:
// Displays the number of tickets assigned to each agent.
// The component receives prepared data from the dashboard and does not
// perform API calls or ticket calculations.

export const AgentTicketSummary = ({ agents }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={5} mt={6}>
      <Heading size="md" mb={4}>
        {" "}
        Tickets by Agents{" "}
      </Heading>

      {agents.map((agent) => (
        <Box key={agent.agentName} mb={3}>
          <Text>
            {" "}
            {agent.agentName} : {agent.ticketCount}{" "}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
