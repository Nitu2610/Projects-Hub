import { ticketsData } from "../data/tickets";
import { TicketCard } from "../components/TicketCard";
import { useState } from "react";
import { Input } from "@chakra-ui/react";

export const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Derived State- If data can be calculated from existing state, don't store it as separate state.  
  const normilizedSearch=searchTerm.trim().toLowerCase();
const filteredTickets = normilizedSearch.length === 0 ?  ticketsData : 
                        ticketsData.filter(   ({ title }) =>
                                    title.toLowerCase().includes(normilizedSearch), 
                                  // Think about condition and its outcome then and how it will work.
                                );

  return (
    <>
      <div>Tickets</div>
      <Input
        placeholder="Search via title"
        value={searchTerm}
        onChange={handleSearch}
      />
      {filteredTickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </>
  );
};
