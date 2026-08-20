import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ticketApi } from "../api/ticketApi";

// Context layer:
// Responsible for managing ticket-related state and sharing it
// with components across the application.
// 
// Architecture:
// Components ➡️ TicketsContext ➡️ ticketApi ➡️ Backend API

export const TicketsContext = createContext();

export const TicketProvider = ({ children }) => {
  // Store the tickets recieved from the backend.
  // The data can be shared with all components that consume TicketsContext.
  const [ticketsData, setTicketsData] = useState([]);

  // Tracks whether a ticket API request is currently in progress.
  const [loading, setLoading] = useState(true);

  // Stores a user-friendly error message when a ticket request fails.
  const [error, setError] = useState("");

  // Get the authentication state from AuthContext.
  // Tickets should only be requested after the user is authenticated.
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch the current user's tickets from the backend
  // and update the context state.
   const fetchTickets = async () => {
      try {
        setLoading(true);

        const response = await ticketApi.getTickets();
        
        setTicketsData(response.data);
        setError("");
      } catch (err) {
        // Prefer the backend's error message when available.
        // Fall back to a general message if the backend does not provide one. 
        setError(err.response?.data?.message || " Unable to fetch tickets.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    // Fetch tickets only after the user has been authenticated.
    // This prevents an unnecessary or unauthorized API request.
    if (!isAuthenticated) return;
   
    fetchTickets();
  }, [isAuthenticated]);

  return (
    <TicketsContext.Provider value={{ ticketsData, loading, error, fetchTickets }}>
      {children}
    </TicketsContext.Provider>
  );
};
