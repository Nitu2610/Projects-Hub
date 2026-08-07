const ticketService = require("../services/ticket.service");

const createTicket = async (req, res) => {
  try {
    const ticket = await ticketService.createTicket(req.body, req.user);
    // ensure createTicket is exported as object!!!

    res.status(201).json({
      status: true,
      message: "Ticket Created Successfully.",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets(req.query, req.user);

    res.status(200).json({
      status: true,
      message: "Fetched all the tickets details.",
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await ticketService.getTicketById(ticketId, req.user);

    if (!ticket.success) {
      if (ticket.reason === "FORBIDDEN")
        return res.status(403).json({
          status: false,
          message: ticket.reason,
          role: ticket.role,
        });
      if (ticket.reason === "NOT_FOUND")
        return res.status(404).json({
          status: false,
          message: ticket.reason,
        });
    }

    res.status(200).json({
      status: true,
      data: ticket.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const updatedTicket = await ticketService.updateTicket(
      ticketId,
      req.body,
      req.user,
    );

    if (!updatedTicket.success) {
      if (updatedTicket.reason === "NOT_FOUND") {
        return res.status(404).json({
          status: false,
          message: "Ticket Not Found",
        });
      }
      if (updatedTicket.reason === "FORBIDDEN") {
        return res.status(403).json({
          status: false,
          message: updatedTicket.reason,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: "Ticket updated successfully.",
      data: updatedTicket.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const replaceTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const replacedTicket = await ticketService.replaceTicket(
      ticketId,
      req.body,
    );

    if (!replacedTicket) {
      return res.status(404).json({
        status: false,
        message: "Ticket Not Found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Ticket Details Replaced Successfully.",
      data: replacedTicket,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { deleteId } = req.params;

    const deletedTicket = await ticketService.deleteTicket(deleteId, req.user);

    if (!deletedTicket.success) {
      if (deletedTicket.reason === "NOT_FOUND") {
        return res.status(404).json({
          status: false,
          message: deletedTicket.reason,
        });
      }
      if (deletedTicket.reason === "FORBIDDEN") {
        return res.status(403).json({
          status: false,
          message: deletedTicket.reason,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: "Ticket deleted successfully.",
      data: deletedTicket.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// -------

const assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { agentId } = req.body;

    const assignedTicket = await ticketService.assignTicket(ticketId, agentId);

    if (!assignedTicket.success) {
      if (
        assignedTicket.reason === "AGENT_NOT_FOUND" ||
        assignedTicket.reason === "TICKET_NOT_FOUND"
      ) {
        return res.status(404).json({
          status: false,
          message: assignedTicket.reason,
        });
      }
      if (assignedTicket.reason === "NOT_AN_AGENT") {
        return res.status(400).json({
          status: false,
          message: assignedTicket.reason,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: "Ticket assigned successfully",
      data: assignedTicket.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  replaceTicket,
  deleteTicket,
  assignTicket,
};
