const express = require("express");

const ticketRouter = express.Router();

const ticketController = require("../controllers/ticket.controller");

// GET
ticketRouter.get("/", ticketController.getAllTickets);
ticketRouter.get("/:ticketId", ticketController.getTicketById); // ensure same variable name is used to to access it from params.

//POST
ticketRouter.post("/", ticketController.createTicket);

// PATCH
ticketRouter.patch("/:ticketId", ticketController.updateTicket);

//PUT
ticketRouter.put("/:ticketId", ticketController.replaceTicket);

// DELETE
ticketRouter.delete("/:deleteId", ticketController.deleteTicket);

module.exports = ticketRouter;
