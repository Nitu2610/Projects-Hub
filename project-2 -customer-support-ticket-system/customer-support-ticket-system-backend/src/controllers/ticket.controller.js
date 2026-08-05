const ticketService = require("../services/ticket.service");

const createTicket = async (req, res) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
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
    const tickets = await ticketService.getAllTickets(req.query);

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

    const ticketById = await ticketService.getTicketById(ticketId);

    if (!ticketById) {
      return res.status(404).json({
        status: false,
        message: "Ticket Not Found!!",
      });
    }

    res.status(200).json({
      status: true,
      data: ticketById,
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

    const updatedTicket = await ticketService.updateTicket(ticketId, req.body);

    if (!updatedTicket) {
      return res.status(404).json({
        status: false,
        message: "Ticket Not Found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Ticket updated successfully.",
      data: updatedTicket,
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

    const deletedTicket = await ticketService.deleteTicket(deleteId);

    if (!deletedTicket) {
      return res.status(404).json({
        status: false,
        message: "Ticket Not Found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Ticket deleted successfully.",
      data: deleteTicket,
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
};
