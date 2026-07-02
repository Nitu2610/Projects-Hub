import { useContext, useState } from "react";
import { TicketsContext } from "../context/TicketsContext";
import { ticketsDataSet } from "../data/tickets";

export const useTickets = () => {
  const [ticketsData, setTicketsData] = useState(ticketsDataSet);
  const context = useContext(TicketsContext);
  return {
    ticketsData,
    setTicketsData,
    context,
  };
};
