const express = require("express");

const ticketRouter = express.Router();

const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles.middleware");
const { validateTicket } = require("../validators/ticket.validator");
const validationMiddleware = require("../middleware/validation.middleware");
const asyncHandler = require("../utils/asyncHandler");

ticketRouter.use(authMiddleware);

// GET
ticketRouter.get("/", asyncHandler(ticketController.getAllTickets));

ticketRouter.get("/:ticketId", asyncHandler(ticketController.getTicketById)); // ensure same variable name is used to to access it from params.

//POST
ticketRouter.post(
  "/",
  authorizeRoles("customer"),
  validateTicket,
  asyncHandler(ticketController.createTicket),
);

// PATCH
ticketRouter.patch(
  "/:ticketId",
  authorizeRoles("admin", "agent"),
  asyncHandler(ticketController.updateTicket),
);

ticketRouter.patch(
  "/:ticketId/assign",
  authorizeRoles("admin"),
  asyncHandler(ticketController.assignTicket),
);

//PUT
ticketRouter.put(
  "/:ticketId",
  authorizeRoles("admin"),
  ticketController.replaceTicket,
);

// DELETE
ticketRouter.delete(
  "/:deleteId",
  authorizeRoles("admin"),
  asyncHandler(ticketController.deleteTicket),
);

// --------- Dashboard endpoints --------------

ticketRouter.get(
  "/dashboard",
  authorizeRoles("admin"),
  asyncHandler(ticketController.getDashboardStats),
);

module.exports = ticketRouter;
