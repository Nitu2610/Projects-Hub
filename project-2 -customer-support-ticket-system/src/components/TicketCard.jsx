import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { formatPriority, formatStatus } from "../utils/formatFieldLables";


export const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  const { id, title, description, status, priority, createdBy, createdAt } =
    ticket;
  //console.log('incoming data' , prop)
  const handleClick = () => navigate(`/tickets/${id}`);

  return (
    <Container>
      <Box onClick={handleClick} > 
        {" "}
        {id}. {title}{" "}
      </Box>
      <Box> {description} </Box>
      <Box>
        {formatStatus(status)}{" "}
      </Box>
      <Box> {formatPriority(priority)} </Box>
      <Box>
        {" "}
        {createdBy} on {createdAt} <hr />
      </Box>
    </Container>
  );
};
