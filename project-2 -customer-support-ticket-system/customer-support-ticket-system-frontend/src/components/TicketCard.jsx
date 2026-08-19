import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { formatPriority, formatStatus } from "../utils/formatFieldLables";


export const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  const { id, title, description, status, priority, createdBy, createdAt } =
    ticket;
  
  // Open the tickets details page when the card is selected.  
  const handleClick = () => navigate(`/tickets/${id}`);

  return (
    <Container>
      <Box onClick={handleClick} > 
        {" "}
        {id}. {title}{" "}
      </Box>
      <Box> Status: {" "}
        {formatStatus(status)}{" "}
      </Box> 
      <Box> Priority :{" "} {formatPriority(priority)} </Box>
      <Box>
        {" "}
       By, {createdBy} <hr />
      </Box>
    </Container>
  );
};
