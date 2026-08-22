import { Box, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getFormatedDate } from "../utils/getFormatedDate";

// TicketCard:
// Responsible for displaying a shor summary of a single ticket.
//
// Data floe:
// Tickets ➡️ TicketCard ➡️ Ticket Details page.

export const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  const { _id, title, status, priority, assignedTo, issueOccurredAt } = ticket;

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
      {/*
        Date formatting is kept outside the component.
        This keeps the UI component focused on rendering data rather
        than handling date formatting logic.
      */}
      <Box>
        {" "}
        Issue Occured : {getFormatedDate(issueOccurredAt, "dateOnly")}{" "}
      </Box>
      {/*
        assignedTo may be null when a ticket has not been assigned.
        Display a fallback message instead of trying to access
        properties from an undefined value.
      */}
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
