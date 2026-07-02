import { useNavigate, useParams } from "react-router-dom";
import { useTickets } from "./useTickets";

export const useTicketById = () => {
  const { id } = useParams(); // return an object(id) with key (id)
    const { ticketsData, setTicketsData } = useTickets();
  let urlId=Number(id);

   const ticketDetailsWithId = ticketsData.find((ticket) => ticket.id === urlId);

  return {
    urlId,
    ticketDetailsWithId
  };
};
