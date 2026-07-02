import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Heading } from "@chakra-ui/react";
import { formatPriority, formatStatus } from "../utils/formatFieldLables";

export const TicketDetails = ({ ticketsData, setTicketsData }) => {
  const { id: urlId } = useParams(); // return an object(id) with key (id)

  let navigate = useNavigate();

  const ticketDetails = ticketsData.find((ticket) => ticket.id === +urlId);

  if (ticketDetails === undefined) {
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
  } = ticketDetails;

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
   <Container  display="flex" justifyContent="space-evenly" mt='20px'  >
       <Button
        onClick={() => {
          navigate("edit");
        }}
      >
        Edit
      </Button>
      <Button onClick={handleDelete}>Delete</Button>
       <Button onClick={()=> navigate('/tickets')}>Back to Ticket Page</Button>
   </Container>
    </>
  );
};
