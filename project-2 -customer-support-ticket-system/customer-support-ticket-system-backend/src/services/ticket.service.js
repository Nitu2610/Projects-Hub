const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const {
  buildFilter,
  buildSort,
  buildPagination,
} = require("../utils/ticketQuery.utils");
const isValidStatusTransition = require("../utils/ticketWorkflow.utils");

// Service responsibility:
// Contains ticket-related business rules and database operations.
// Controllers pass validated request data to this layer and receive
// a standardized result that can be translated into an HTTP response.
//------------------------------------------------------------------------

// Create a new ticket for the authenticated customer.
// The creator is taken from the authenticated user rather than
// trusting the client to provide a createdBy value.

const createTicket = async (ticketData, user) => {
  // Associate the ticket with the authenticated user.
  const ticketDetails = { ...ticketData, createdBy: user.id };
  const createdTicket = await Ticket.create(ticketDetails);

  return {
    success: true,
    message: "Ticket created successfully.",
    data: createdTicket,
  };
};

// Retrieve tickets using role-based filtering, sorting, and pagination.
// Query parameters are converted into MongoDB query options by the
// ticket query utility functions.

const getAllTickets = async (query, user) => {
  // Build database query options from the client's query parameters.
  const filter = buildFilter(query, user);
  const sort = buildSort(query);
  const { skip, limit } = buildPagination(query);
  const tickets = await Ticket.find(filter).sort(sort).skip(skip).limit(limit);
  return {
    success: true,
    message: "Tickets retrieved successfully.",
    data: tickets,
  };
};

// Retrieve a ticket and enforce resource-level authorization.
// Customers can access their own tickets, agents can access tickets
// assigned to them, and administrators can access all tickets.

const getTicketById = async (ticketId, user) => {
  const ticket = await Ticket.findById(ticketId)
    .populate("createdBy", "firstName lastName email")
    .populate("assignedTo", "firstName lastName");

  // Return a controlled result so the controller can translate it
  // into the appropriate HTTP response.
  if (!ticket) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "Ticket not found.",
    };
  }

  if (user.role === "customer") {
    if (ticket.createdBy._id.toString() === user.id) {
      return {
        success: true,
        message: "Ticket retrieved successfully.",
        data: ticket,
      };
    }
  }

  if (user.role === "agent") {
    if (ticket.assignedTo && ticket.assignedTo._id.toString() === user.id) {
      return {
        success: true,
        message: "Ticket retrieved successfully.",
        data: ticket,
      };
    }
  }

  if (user.role === "admin") {
    return {
      success: true,
      message: "Ticket retrieved successfully.",
      data: ticket,
    };
  }

  return {
    success: false,
    message: "User doesn't have the authority to access data.",
    code: "FORBIDDEN",
  };
};

// Update a ticket while enforcing role-specific business rules.
// Administrators can update ticket fields directly, while agents
// can update only permitted fields on tickets assigned to them.

const updateTicket = async (ticketId, updateData, user) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "Ticket not found.",
    };
  }

  // Capture the current and requested workflow values before applying
  // status-transition and resolution validation.
  const currentStatus = ticket.status;
  const requestedStatus = updateData.status;
  const requestedResolution = updateData.resolution;

  // Administrators are allowed to update the complete ticket payload.
  // Mongoose validators still protect the stored document.
  if (user.role === "admin") {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      updateData,
      {
        returnDocument: "after", // It return new updated data/ after update data, without it DB will return old data or before value
        runValidators: true, // ensure only the selected values are updated as set in the mongoose Schma.
      },
    );
    return {
      success: true,
      message: "Ticket updated successfully.",
      data: updatedTicket,
    };
  }

  // Agents can modify tickets only when the ticket is assigned to them.
  if (
    user.role === "agent" &&
    ticket.assignedTo &&
    ticket.assignedTo.toString() === user.id
  ) {
    // Restrict agent updates to fields that agents are permitted to modify.
    const allowedFields = ["status", "priority", "resolution"];

    // Prevent agents from bypassing the defined ticket workflow.
    if (
      requestedStatus &&
      !isValidStatusTransition(currentStatus, requestedStatus)
    ) {
      return {
        success: false,
        message: "Invalid status transition.",
        code: "INVALID_STATUS_TRANSITION",
      };
    }

    const resolution =
      requestedResolution !== undefined
        ? requestedResolution
        : ticket.resolution;

    // A ticket cannot be resolved without providing resolution details.
    if (requestedStatus === "Resolved") {
      if (!resolution || !resolution.trim()) {
        return {
          success: false,
          message: "Resolution details are required.",
          code: "RESOLUTION_REQUIRED",
        };
      }
    }

    // Build an allowed update object instead of passing the entire
    // client payload to MongoDB.
    const sanitizedUpdate = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        sanitizedUpdate[field] = updateData[field];
      }
    }

    if (Object.keys(sanitizedUpdate).length === 0) {
      return {
        success: false,
        message: "No valid fields provided for update.",
        code: "NO_VALID_FIELDS",
      };
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      sanitizedUpdate,
      {
        returnDocument: "after", // It return new updated data/ after update data, without it DB will return old data or before value
        runValidators: true, // ensure only the selected values are updated as set in the mongoose Schma.
      },
    );
    return {
      success: true,
      message: "Ticket updated successfully.",
      data: updatedTicket,
    };
  }

  return {
    success: false,
    message: "User doesn't have the authority to access the data.",
    code: "FORBIDDEN",
  };
};

// Replace the complete ticket document.
// This operation is exposed only to administrators through the route
// authorization layer.
const replaceTicket = async (ticketId, ticketData) => {
  const replacedTicket = await Ticket.findOneAndReplace(
    { _id: ticketId },
    ticketData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return {
    success: true,
    message: "Ticket replaced successfully.",
    data: replacedTicket,
  };
};

// Delete a ticket after verifying that it exist.
// Only administrators are permitted to permanently remove tickets.
const deleteTicket = async (ticketId, user) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return {
      success: false,
      message: "Ticket not found.",
      code: "NOT_FOUND",
    };
  }
  if (user.role === "admin") {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    return {
      success: true,
      message: "Ticket deleted successfully.",
      data: deletedTicket,
    };
  }
  return {
    success: false,
    message: "User doesn't have the authority to perform the action.",
    code: "FORBIDDEN",
  };
};

// Assign a ticket to a valid agent.
// The service verifies both the ticket and target user before
// changing the assignment.
const assignTicket = async (ticketId, agentId) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return {
      success: false,
      code: "_NOT_FOUND",
      message: "Ticket not found.",
    };
  }

  const agent = await User.findById(agentId);
  if (!agent) {
    return {
      success: false,
      code: "AGENT_NOT_FOUND",
      message: "Agent not found.",
    };
  }

  if (agent.role !== "agent") {
    return {
      success: false,
      code: "NOT_AN_AGENT",
      message: "User is not an agent.",
    };
  }

  const assignmentData = { assignedTo: agentId };
  const assignedTicket = await Ticket.findByIdAndUpdate(
    ticketId, 
    assignmentData, 
    {
    returnDocument: "after",
    runValidators: true,
    }
  ).populate("assignedTo", "firstName");

  return {
    success: true,
    message: "Ticket is assigned successfully.",
    data: assignedTicket,
  };
};

// Build aggregated statistics for the administrator dashboard.
// Ticket counts are grouped by status, priority, and assigned agent
// so the dashboard can consume summarized data without performing
// these calculations on the client.
const getDashboardStats = async () => {
  const totalTickets = await Ticket.countDocuments();

  // Group tickets by status.
  const ticketsByStatus = await Ticket.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        ticketCount: "$count",
      },
    },
    {
      $sort: {
        status: -1,
      },
    },
  ]);

  // Group tickets by priority.
  const ticketsByPriority = await Ticket.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        priority: "$_id",
        ticketCount: "$count",
      },
    },
    {
      $sort: {
        ticketCount: 1,
      },
    },
  ]);

  // Group tickets by assigned agent, including unassigned tickets.
  const ticketsByAgent = await Ticket.aggregate([
    {
      $group: {
        _id: "$assignedTo",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id", // field in the current collection
        foreignField: "_id", // field in the other collection
        as: "agent",
      },
    },
    {
      $unwind: {
        path: "$agent", // it expands an array into individual documents(object format).
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        agentName: {
          $cond: [
            { $eq: ["$_id", null] }, // if _id(agent) is  equal to null ? true: false
            "Unassigned",
            { $concat: ["$agent.firstName", " ", "$agent.lastName"] },
          ],
        },
        ticketCount: "$count",
      },
    },
  ]);

  return {
    success: true,
    message: "Stats retrieved successfully.",
    data: {
      totalTickets,
      ticketsByStatus,
      ticketsByPriority,
      ticketsByAgent,
    },
  };
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  replaceTicket,
  deleteTicket,
  assignTicket,
  getDashboardStats,
};
