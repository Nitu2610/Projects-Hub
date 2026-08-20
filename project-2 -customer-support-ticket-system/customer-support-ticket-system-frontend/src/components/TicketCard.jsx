import { Box, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// TicketCard:
// Responsible for displaying a shor summary of a single ticket.
//
// Data floe:
// Tickets ➡️ TicketCard ➡️ Ticket Details page.

export const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  const { _id, title, status, priority, assignedTo } = ticket;

  // Open the tickets details page when the card is selected.
  const handleClick = () => navigate(`/tickets/${_id}`);

  return (
    <Container>
      <Box onClick={handleClick}>
        {" "}
        {"✔️"}
        {title}{" "}
      </Box>
      <Box> Status: {status} </Box>
      <Box> Priority : {priority} </Box>

      <Box>
        {" "}
        Assigned To,{" "}
        {assignedTo
          ? `${assignedTo.firstName} ${assignedTo.lastName}`
          : "Not assigned"}{" "}
        <hr />
      </Box>
    </Container>
  );
};
