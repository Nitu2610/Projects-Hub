import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ticketApi } from "../api/ticketApi";
import { AuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { toaster } from "../components/ui/toaster";

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
  const [deleting, setDeleting] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the ticket whenever the ticket ID in the URL changes.
    const fetchTicket = async () => {
      try {
        setDeleting(true);
        const response = await ticketApi.getTicketById(ticketId);
        setTicket(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch ticket.");
      } finally {
        setDeleting(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (deleting) return <Loading />;
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
    <>
      <Text>
        {" "}
        <strong>Ticket Details for Id: </strong> {_id}{" "}
      </Text>

      <Container>
        <Box>
          {" "}
          <strong> Title: </strong> {title}{" "}
        </Box>
        <Box>
          {" "}
          <strong> Description: </strong> {description}{" "}
        </Box>
        <Box>
          {" "}
          <strong> Status: </strong> {status}{" "}
        </Box>
        <Box>
          {" "}
          <strong> Priority: </strong> {priority}{" "}
        </Box>
        <Box>
          {" "}
          <strong> Issue Occured : </strong> {issueOccurredAt}
        </Box>
        <Box>
          {" "}
          <strong> Assigned To: </strong>{" "}
          {assignedTo
            ? `${assignedTo.firstName} ${assignedTo.lastName}`
            : "Not assigned"}
        </Box>

        <Box>
          {" "}
          <strong> Resolution: </strong> {resolution || "Working on ticket"}
        </Box>
      </Container>

      <Container display="flex" justifyContent="space-evenly" mt="20px">
        <Button onClick={() => navigate("/")}>Back to Ticket Page</Button>

        {/*  Agents and admins can edit tickets. */}
        {(user.role === "agent" || user.role === "admin") && (
          <Button onClick={() => navigate(`/tickets/${ticketId}/edit`)}>
            Edit Ticket
          </Button>
        )}

        {/* Only admins are allowed to delete tickets. */}
        {user.role === "admin" && (
          <Button onClick={handleDelete}>Delete Ticket</Button>
        )}
      </Container>
    </>
  );
};
