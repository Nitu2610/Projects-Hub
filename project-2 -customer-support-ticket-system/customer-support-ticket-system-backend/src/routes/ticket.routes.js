const express = require("express");
const ticketRouter = express.Router();
const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles.middleware");
const { validateTicket } = require("../validators/ticket.validator");
const validationMiddleware = require("../middleware/validation.middleware");
const asyncHandler = require("../utils/asyncHandler");

// Ticket route flow:
// Request ➡️ authentication ➡️ authorization/validation ➡️ cotroller ➡️ services.
//
// All ticket endpoints require an authenticated user. Individual routes
// apply role authorization or request validation where required.

ticketRouter.use(authMiddleware);

// Dashboard endpoints.
// Dashboard statistics are restricted to administrators because they
// provide system-wide ticket information.

ticketRouter.get(
  "/dashboard",
  authorizeRoles("admin"),
  asyncHandler(ticketController.getDashboardStats),
);

// Retrieve tickets.
// Access to individual tickets is further restricted by ownership or
// assignment rules inside the ticket service.

ticketRouter.get("/", asyncHandler(ticketController.getTickets));

ticketRouter.get("/:ticketId", asyncHandler(ticketController.getTicketById));

// Create a ticket.
// Only customer can create support tickets.

ticketRouter.post(
  "/",
  authorizeRoles("customer"),
  validateTicket,
  validationMiddleware,
  asyncHandler(ticketController.createTicket),
);

// Update ticket fields.
// Administrators and assigned agents can update tickets, while the
// service layer applies role- specific business rules.
ticketRouter.patch(
  "/:ticketId",
  authorizeRoles("admin", "agent"),
  asyncHandler(ticketController.updateTicket),
);

// Assign a ticket to an agent.
// Only administrators can assign or reassign tickets.

ticketRouter.patch(
  "/:ticketId/assign",
  authorizeRoles("admin"),
  asyncHandler(ticketController.assignTicket),
);

// Replace the complete ticket resouce.
// This operation is restricted to administrators.

ticketRouter.put(
  "/:ticketId",
  authorizeRoles("admin"),
  asyncHandler(ticketController.replaceTicket),
);

// Delete a ticket.
// Ticket deletion is restricted to administrators.

ticketRouter.delete(
  "/:ticketId",
  authorizeRoles("admin"),
  asyncHandler(ticketController.deleteTicket),
);

module.exports = ticketRouter;
