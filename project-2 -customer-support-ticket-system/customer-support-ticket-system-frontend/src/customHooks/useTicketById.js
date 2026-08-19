import { useNavigate, useParams } from "react-router-dom";
import { useTickets } from "./useTickets";

export const useTicketById = () => {

  // Get the ticket ID from the URL and use it to find the matching ticket.
  const { ticketId } = useParams(); // return an object(id) with key (id)
    const { ticketsData, setTicketsData } = useTickets();
  let urlId=Number(ticketId);

   const ticketDetailsWithId = ticketsData.find((ticket) => ticket.ticketId === urlId);

  return {
    urlId,
    ticketDetailsWithId
  };
};
