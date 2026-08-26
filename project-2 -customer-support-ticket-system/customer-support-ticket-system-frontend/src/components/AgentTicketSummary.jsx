import { Box, Heading, Text } from "@chakra-ui/react";

// AgentTicketSummary:
// Displays the number of tickets assigned to each agent.
// The component receives prepared data from the dashboard and does not
// perform API calls or ticket calculations.

export const AgentTicketSummary = ({ agents }) => {
  return (
    <Box
      bg="support.surface"
      border="1px solid"
      borderColor="support.border"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
    >
      <Heading
        size={{ base: "md", md: "lg" }}
        color="support.text"
        mb={5}
      >
        Tickets by Agent
      </Heading>

      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={3}
      >
        {agents.map((agent) => (
          <Box
            key={agent.agentName}
            bg="support.background"
            border="1px solid"
            borderColor="support.border"
            borderRadius="lg"
            p={4}
          >
            <Text
              color="support.muted"
              fontSize="sm"
              mb={1}
            >
              {agent.agentName}
            </Text>

            <Text
              color="support.text"
              fontSize="2xl"
              fontWeight="bold"
            >
              {agent.ticketCount}
            </Text>

            <Text
              color="support.muted"
              fontSize="xs"
            >
              Assigned tickets
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};