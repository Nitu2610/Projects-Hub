import { useParams } from "react-router-dom";
import { ticketsData } from "../data/tickets";
import { Box, Container, Heading } from "@chakra-ui/react";
import { formatPriority, formatStatus } from "../utils/formatFieldLables";

export const TicketDetails = () => {
  const { id } = useParams(); // return an object(id) with key (id)
  const ticketId = +id;
  // console.log(typeof ticketId)
  const ticketDetails = ticketsData.find((ticket) => ticket.id === ticketId);
  // console.log(ticketDetails);
  if (ticketDetails === undefined) {
    return <Heading> Ticket ID {ticketId} not found. </Heading>;
  } // first check the condition then only destructure!!! 
  const {
    title,
    description,
    status,
    priority,
    createdBy,
    createdAt,
  } = ticketDetails;

  return (
    <>
      <Heading>Tickets Details for Id: {ticketId}</Heading>

      <Container>
        <Box> Title: {" "} {title} </Box>
        <Box> Description:{" "} {description} </Box>
        <Box> Status:{" "}
          {formatStatus(status)}{" "}
        </Box>
        <Box> Priority:
          {" "}
          {formatPriority(priority)}{" "}
        </Box>
        <Box> Created by:
          {" "}
          {createdBy}
        </Box>
         <Box> Created on:
          {" "}
          {createdAt} 
             </Box> <hr />
      </Container>
    </>
  );
};
