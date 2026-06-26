
import { ticketsData } from "../data/tickets";
import { TicketCard } from "../components/TicketCard";

export const Tickets = () => {
  return (
    <>
      <div>Tickets</div>
        {ticketsData.map(
          (ticket) => 
            <TicketCard key={ticket.id} ticket={ticket} />
          
        )}
    </>
  );
};
