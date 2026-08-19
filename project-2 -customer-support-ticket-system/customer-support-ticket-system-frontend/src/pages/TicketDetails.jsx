import { Box, Button, Container, Heading } from "@chakra-ui/react";
import { formatPriority, formatStatus } from "../utils/formatFieldLables";
import { useTickets } from "../customHooks/useTickets";
import { useTicketById } from "../customHooks/useTicketById";
import { useNavigate } from "react-router-dom";

export const TicketDetails = () => {
  const { ticketsData, setTicketsData } = useTickets();
  const { urlId, ticketDetailsWithId } = useTicketById();
    let navigate = useNavigate();
  
  // Check that the ticket exists before using its details.
  if (ticketDetailsWithId === undefined) {
    return <Heading> Ticket ID {urlId} not found. </Heading>;
  } // first check the condition then only destructure!!!

  const {
    id: filteredId,
    title,
    description,
    status,
    priority,
    createdBy,
    createdAt,
  } = ticketDetailsWithId;

  // Remove the selected ticket and return to the ticket list.
  const handleDelete = () => {
    let dataAfterDelete = ticketsData.filter(({ id }) => id !== +urlId);
    setTicketsData(dataAfterDelete);
    navigate("/tickets");
  };

  //console.log(filteredId);

  return (
    <>
      <Heading>Tickets Details for Id: {urlId}</Heading>

      <Container>
        <Box> Title: {title} </Box>
        <Box> Description: {description} </Box>
        <Box> Status: {formatStatus(status)} </Box>
        <Box> Priority: {formatPriority(priority)} </Box>
        <Box> Created by: {createdBy}</Box>
        <Box> Created on: {createdAt}</Box>
      </Container>
      <Container display="flex" justifyContent="space-evenly" mt="20px">
        <Button
          onClick={() => {
            navigate("edit");
          }}
        >
          Edit
        </Button>
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={() => navigate("/tickets")}>
          Back to Ticket Page
        </Button>
      </Container>
    </>
  );
};
