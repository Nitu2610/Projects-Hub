// API layer:
// Responsible only for communicating with the backend ticket endpoints.
// It keeps HTTP/request logic separate from React components and context.

import { axiosInstance } from "./axiosInstance";

export const ticketApi = {
  // Fetch tickets available to the current authenticated user.
  // axiosInstance handles the common API configuration and authentication.
  getTickets: async () => {
    const response = await axiosInstance.get("/tickets");
    return response.data;
  },

  // Fetch a single ticket using its ID.
  // The ticket ID comes from the ticket details route.
  getTicketById: async (ticketId) => {
    const response = await axiosInstance.get(`/tickets/${ticketId}`);
    return response.data;
  },

  // Create a new ticket in the backend.
  // Ticket state is managed by TicketContext, while this layer
  // is responsible only for making the API request.
  createTicket: async (ticketData) => {
    const response = await axiosInstance.post("/tickets", ticketData);
    return response.data;
  },

  // Update an existing ticket.
  // Backend controls which fields and roles are allowed to update it.
  updateTicket: async (ticketId, ticketData) => {
    const response = await axiosInstance.patch(
      `/tickets/${ticketId}`,
      ticketData,
    );
    return response.data;
  },

  // Delete a ticket:
  // Backend allows this operations only for authorized admin users.
  deleteTicket: async (ticketId) => {
    const response = await axiosInstance.delete(`/tickets/${ticketId}`);
    return response.data;
  },

  // Assign a ticket to an agent.
  // The backend verifies that the selected user is a valid agent.
  assignTicket: async (ticketId, agentId) => {
    const response = await axiosInstance.patch(`/tickets/${ticketId}/assign`, {
      agentId,
    });
    return response.data;
  },

  // Fetch aggregated statics for the admin dashboard.
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/tickets/dashboard");
    return response.data;
  },
};
