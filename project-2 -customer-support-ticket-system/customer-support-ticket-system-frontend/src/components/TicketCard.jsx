import { Badge, Box, Card, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getFormatedDate } from "../utils/getFormatedDate";

// TicketCard:
// Responsible for displaying a short summary of a single ticket.
//
// Data flow:
// Tickets ➡️ TicketCard ➡️ Ticket Details page.

export const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    status,
    priority,
    assignedTo,
    issueOccurredAt,
  } = ticket;

  const statusColor = {
    Open: "blue",
    "In Progress": "orange",
    Resolved: "green",
    Closed: "gray",
  };

  const priorityColor = {
    Low: "green",
    Medium: "yellow",
    High: "orange",
    Critical: "red",
  };

  const handleOpenTicket = () => {
    navigate(`/tickets/${_id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenTicket();
    }
  };

  return (
    <Card.Root
      mb={4}
      bg="support.surface"
      border="1px solid"
      borderColor="support.border"
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.2s ease"
      tabIndex={0}
      role="button"
      aria-label={`View ticket: ${title}`}
      onClick={handleOpenTicket}
      onKeyDown={handleKeyDown}
      _hover={{
        borderColor: "blue.300",
        shadow: "md",
        transform: "translateY(-2px)",
      }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "blue.500",
        outlineOffset: "2px",
      }}
    >
      <Card.Body p={{ base: 4, md: 5 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={4}
        >
          <Box minW={0}>
            <Text
              fontSize="xs"
              color="support.muted"
              mb={1}
            >
              Ticket
            </Text>

            <Heading
              size={{ base: "sm", md: "md" }}
              color="support.text"
              lineHeight="1.4"
            >
              {title}
            </Heading>
          </Box>

          {/* Priority */}
          <Badge
            colorPalette={priorityColor[priority] || "gray"}
            variant="subtle"
            flexShrink={0}
          >
            {priority}
          </Badge>
        </Box>

        {/* Ticket information */}
        <Box
          mt={4}
          display="grid"
          gridTemplateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={{ base: 3, md: 5 }}
        >
          <Box>
            <Text
              fontSize="xs"
              color="support.muted"
              mb={1}
            >
              Status
            </Text>

            <Badge
              colorPalette={statusColor[status] || "gray"}
              variant="subtle"
            >
              {status}
            </Badge>
          </Box>

          <Box>
            <Text
              fontSize="xs"
              color="support.muted"
              mb={1}
            >
              Issue occurred
            </Text>

            <Text
              fontSize="sm"
              color="support.text"
            >
              {getFormatedDate(
                issueOccurredAt,
                "dateOnly",
              )}
            </Text>
          </Box>

          <Box>
            <Text
              fontSize="xs"
              color="support.muted"
              mb={1}
            >
              Assigned to
            </Text>

            <Text
              fontSize="sm"
              color="support.text"
              wordBreak="break-word"
            >
              {assignedTo
                ? `${assignedTo.firstName} ${assignedTo.lastName}`
                : "Not assigned"}
            </Text>
          </Box>
        </Box>

        {/* Footer hint */}
        <Text
          mt={4}
          pt={3}
          borderTop="1px solid"
          borderColor="support.border"
          fontSize="xs"
          color="support.muted"
        >
          View ticket details →
        </Text>
      </Card.Body>
    </Card.Root>
  );
};