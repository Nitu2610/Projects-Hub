import { createContext, useState } from "react";
import { ticketsDataSet } from "../data/tickets";

export const TicketsContext = createContext();

export const TicketProvider = ({ children }) => {
  // Store the ticket data so it can be shared across ticket-related components.
  const [ticketsData, setTicketsData] = useState(ticketsDataSet);
  return (
    <TicketsContext.Provider value={{ ticketsData, setTicketsData }}>
      {children}
    </TicketsContext.Provider>
  );
};
