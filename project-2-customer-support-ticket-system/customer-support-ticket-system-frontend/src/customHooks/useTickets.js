import { useContext } from "react";
import { TicketsContext } from "../context/TicketsContext";

// Custom hook for accessing ticket-related state and actions.
// Keeps components from importing and calling TicketsContext directly.
// 
// Architecture:
// Components ➡️ useTickets ➡️ TicketsContext


// Instead of importing useContext and TicketsContext in very file we use this helper fn.
export const useTickets = () => {
  return useContext(TicketsContext);
};
