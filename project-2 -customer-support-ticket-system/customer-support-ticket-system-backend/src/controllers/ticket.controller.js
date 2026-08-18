const ticketService = require("../services/ticket.service");

// Controller responsibility:
// Handle HTTP request/response concerns for the ticket domain.
// Business rules and database operations remain inside the ticket service.
const createTicket = async (req, res) => {
  const createdTicket = await ticketService.createTicket(req.body, req.user);

  res.status(201).json({
    success: createdTicket.success,
    message: createdTicket.message,
    data: createdTicket.data,
  });
};

// Retrieve tickets based on the authenticated user's role and
// query parameters such as filtering, sorting, and pagination.

const getTickets = async (req, res) => {
  const tickets = await ticketService.getAllTickets(req.query, req.user);

  res.status(200).json({
    success: tickets.success,
    message: tickets.message,
    count: tickets.data.length,
    data: tickets.data,
  });
};

// Retrieve a single ticket.
// The service layer verifies whether the authenticated user is
// allowed to access the requested ticket.

const getTicketById = async (req, res) => {
  const { ticketId } = req.params;

  const ticketResult = await ticketService.getTicketById(ticketId, req.user);

  if (!ticketResult.success) {
    if (ticketResult.code === "FORBIDDEN") {
      return res.status(403).json({
        success: ticketResult.success,
        message: ticketResult.message,
      });
    }
    if (ticketResult.code === "NOT_FOUND") {
      return res.status(404).json({
        success: ticketResult.success,
        message: ticketResult.message,
      });
    }
  }

  res.status(200).json({
    success: ticketResult.success,
    message: ticketResult.message,
    data: ticketResult.data,
  });
};

// Update selected ticket fields.
// The service applies different update rules depending on whether
// the authenticated user is an administrator or an assigned agent.

const updateTicket = async (req, res) => {
  const { ticketId } = req.params;

  const updateResult = await ticketService.updateTicket(
    ticketId,
    req.body,
    req.user,
  );

  if (!updateResult.success) {
    if (updateResult.code === "NOT_FOUND") {
      return res.status(404).json({
        success: updateResult.success,
        message: updateResult.message,
      });
    }
    if (updateResult.code === "FORBIDDEN") {
      return res.status(403).json({
        success: updateResult.success,
        message: updateResult.message,
      });
    }
    if (updateResult.code === "INVALID_STATUS_TRANSITION") {
      return res.status(400).json({
        success: updateResult.success,
        message: updateResult.message,
      });
    }
    if (updateResult.code === "RESOLUTION_REQUIRED") {
      return res.status(422).json({
        success: updateResult.success,
        message: updateResult.message,
      });
    }
    if (updateResult.code === "NO_VALID_FIELDS") {
      return res.status(400).json({
        success: updateResult.success,
        message: updateResult.message,
      });
    }
  }

  return res.status(200).json({
    success: updateResult.success,
    message: updateResult.message,
    data: updateResult.data,
  });
};

// Replace the complete ticket resource.
// This operation is restricted to administrators at the route level.

const replaceTicket = async (req, res) => {
  const { ticketId } = req.params;

  const replaceResult = await ticketService.replaceTicket(ticketId, req.body);

  if (!replaceResult.success) {
    return res.status(404).json({
      success: replaceResult.success,
      message: replaceResult.message,
    });
  }

  return res.status(200).json({
    success: replaceResult.success,
    message: replaceResult.message,
    data: replaceResult.data,
  });
};

// Delete a ticket.
// The service verifies the ticket's existence and applies the
// authorization rule before performing the deletion.

const deleteTicket = async (req, res) => {
  const { ticketId } = req.params;

  const deleteResult = await ticketService.deleteTicket(ticketId, req.user);

  if (!deleteResult.success) {
    if (deleteResult.code === "NOT_FOUND") {
      return res.status(404).json({
        success: deleteResult.success,
        message: deleteResult.message,
      });
    }
    if (deleteResult.code === "FORBIDDEN") {
      return res.status(403).json({
        success: deleteResult.success,
        message: deleteResult.message,
      });
    }
  }

  return res.status(200).json({
    success: deleteResult.success,
    message: deleteResult.message,
    data: deleteResult.data,
  });
};

// Assign a ticket to an agent.
// The service verifies that the ticket exists and that the selected
// user is a valid agent before updating the assignment.

const assignTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { agentId } = req.body;

  const assignmentResult = await ticketService.assignTicket(ticketId, agentId);

  if (!assignmentResult.success) {
    if (
      assignmentResult.code === "AGENT_NOT_FOUND" ||
      assignmentResult.code === "TICKET_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: assignmentResult.success,
        message: assignmentResult.message,
      });
    }
    if (assignmentResult.code === "NOT_AN_AGENT") {
      return res.status(400).json({
        success: assignmentResult.success,
        message: assignmentResult.message,
      });
    }
  }

  return res.status(200).json({
    success: assignmentResult.success,
    message: assignmentResult.message,
    data: assignmentResult.data,
  });
};

// Retrieve aggregated ticket statistics for the administrator dashboard.

const getDashboardStats = async (req, res) => {
  const dashboardStats = await ticketService.getDashboardStats();

  return res.status(200).json({
    success: dashboardStats.success,
    message: dashboardStats.message,
    data: dashboardStats.data,
  });
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  replaceTicket,
  deleteTicket,
  assignTicket,
  getDashboardStats,
};
