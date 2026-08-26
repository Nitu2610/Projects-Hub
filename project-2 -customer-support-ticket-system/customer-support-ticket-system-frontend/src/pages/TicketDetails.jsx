import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ticketApi } from "../api/ticketApi";
import { AuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { toaster } from "../components/ui/toaster";
import { getFormatedDate } from "../utils/getFormatedDate";

// TicketDetails Page:
// Loads and displays one ticket based on the ID from the URL.
//
// Data flow:
// Route parameter ➡️ TicketDetails ➡️ ticketApi ➡️ Backend API
//                                        ⬇️
//                                     Ticket data
//
// Unlike the ticket page, this component keeps the selected ticket
// in local state because the data belongs only to this page.

export const TicketDetails = () => {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the ticket whenever the ticket ID in the URL changes.
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await ticketApi.getTicketById(ticketId);
        setTicket(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!ticket) return <Heading> Ticket not found. </Heading>;

  const {
    _id,
    title,
    description,
    status,
    priority,
    assignedTo,
    issueOccurredAt,
    resolution,
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

  // Deletes the current ticket and return to home page.
  // The backend should also endorce the admin authorization rule.
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed) return;
    try {
      await ticketApi.deleteTicket(ticketId);
      // Notify the user after the ticket is successfully deleted.
      toaster.create({
        title: "Ticket deleted",
        description: "Ticket deleted successfully.",
        type: "success",
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete ticket.");
    }
  };
  return (
    <Box
      minH="calc(100vh - 64px)"
      bg="support.background"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="900px">
        {/* Back navigation */}
        <Button
          variant="ghost"
          colorPalette="blue"
          fontWeight="bold"
          fontSize="md"
          borderRadius="l"
          mb={5}
          onClick={() => navigate("/")}
        >
          ⬅️ Back to tickets
        </Button>

        {/* Header */}
        <Box mb={6}>
          <Text fontSize="sm" color="support.muted" mb={2}>
            Ticket #{_id}
          </Text>

          <Heading
            size={{ base: "xl", md: "2xl" }}
            color="support.text"
            wordBreak="break-word"
          >
            {title}
          </Heading>

          {/* Status / Priority */}
          <Box display="flex" flexWrap="wrap" gap={3} mt={4}>
            <Badge colorPalette={statusColor[status] || "gray"}>{status}</Badge>

            <Badge colorPalette={priorityColor[priority] || "gray"}>
              {priority} Priority
            </Badge>
          </Box>
        </Box>

        {/* Ticket information */}
        <Card.Root
          bg="support.surface"
          border="1px solid"
          borderColor="support.border"
          borderRadius="xl"
          shadow="sm"
        >
          <Card.Body p={{ base: 5, md: 8 }}>
            {/* Description */}
            <Box mb={7}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="support.muted"
                mb={2}
              >
                Description
              </Text>

              <Text color="support.text" whiteSpace="pre-wrap" lineHeight="1.7">
                {description}
              </Text>
            </Box>

            {/* Metadata */}
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
              }}
              gap={6}
              pt={6}
              borderTop="1px solid"
              borderColor="support.border"
            >
              <Box>
                <Text fontSize="sm" color="support.muted" mb={1}>
                  Issue occurred
                </Text>

                <Text color="support.text">
                  {getFormatedDate(issueOccurredAt, "dateOnly")}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="support.muted" mb={1}>
                  Assigned to
                </Text>

                <Text color="support.text">
                  {assignedTo
                    ? `${assignedTo.firstName} ${assignedTo.lastName}`
                    : "Not assigned"}
                </Text>
              </Box>
            </Box>

            {/* Resolution */}
            <Box
              mt={7}
              pt={6}
              borderTop="1px solid"
              borderColor="support.border"
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="support.muted"
                mb={2}
              >
                Resolution
              </Text>

              <Text
                color={resolution ? "support.text" : "support.muted"}
                whiteSpace="pre-wrap"
                lineHeight="1.7"
              >
                {resolution || "Working on ticket"}
              </Text>
            </Box>
          </Card.Body>
        </Card.Root>

        {/* Actions */}
        <Box
          display="flex"
          flexDirection={{
            base: "column",
            sm: "row",
          }}
          gap={3}
          mt={6}
        >
          {(user.role === "agent" || user.role === "admin") && (
            <Button
              colorPalette="blue"
              onClick={() => navigate(`/tickets/${ticketId}/edit`)}
              flex="1"
            >
              Edit Ticket
            </Button>
          )}

          {user.role === "admin" && (
            <Button
              colorPalette="red"
              variant="outline"
              onClick={handleDelete}
              flex="1"
            >
              Delete Ticket
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};
