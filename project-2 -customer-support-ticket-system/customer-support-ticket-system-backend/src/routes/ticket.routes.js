const express = require("express");

const ticketRouter = express.Router();

const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles.middleware");
const {validateTicket}= require("../validators/ticket.validator");
const validationMiddleware= require("../middleware/validation.middleware")

ticketRouter.use(authMiddleware);

// GET
ticketRouter.get("/", ticketController.getAllTickets);
ticketRouter.get("/:ticketId", ticketController.getTicketById); // ensure same variable name is used to to access it from params.

//POST
ticketRouter.post("/", authorizeRoles("customer"), validateTicket,  ticketController.createTicket);

// PATCH
ticketRouter.patch(
  "/:ticketId",
  authorizeRoles("admin", "agent"),
  ticketController.updateTicket,
);

//PUT
ticketRouter.put("/:ticketId",authorizeRoles("admin"), ticketController.replaceTicket);

// DELETE
ticketRouter.delete(
  "/:deleteId",
  authorizeRoles("admin"),
  ticketController.deleteTicket,
);

module.exports = ticketRouter;
