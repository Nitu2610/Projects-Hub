const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

const {
  buildFilter,
  buildSort,
  buildPagination,
} = require("../utils/ticketQuery.utils");

const createTicket = async (ticketData, user) => {
  const ticketDetails = { ...ticketData, createdBy: user.id };
  const ticket = await Ticket.create(ticketDetails);

  return ticket;
};

const getAllTickets = async (query, user) => {
  const filter = buildFilter(query, user);
  const sort = buildSort(query);
  const { skip, limit } = buildPagination(query);
  return await Ticket.find(filter).sort(sort).skip(skip).limit(limit);
};

const getTicketById = async (ticketId, user) => {
  const ticket = await Ticket.findById(ticketId)
    .populate("createdBy", "firstName lastName email")
    .populate("assignedTo", "firstName lastName");

  if (!ticket)
    return {
      success: false,
      reason: "NOT_FOUND",
    };

  if (user.role === "customer") {
    //  console.log("----------------- Debugging --------------")
    //  console.log("Inside Customer")
    //     console.log(ticket.createdBy._id.toString())
    if (ticket.createdBy._id.toString() === user.id) {
      return {
        success: true,
        data: ticket,
      };
    }
  }

  if (user.role === "agent") {
    if (ticket.assignedTo._id.toString() === user.id) {
      return {
        success: true,
        data: ticket,
      };
    }
  }

  if (user.role === "admin") {
    return {
      success: true,
      data: ticket,
    };
  }

  return {
    success: false,
    reason: "FORBIDDEN",
    role: user.role,
  };
};

const updateTicket = async (ticketId, updatedData, user) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return {
      success: false,
      reason: "NOT_FOUND",
    };
  }
  if (user.role === "admin") {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      updatedData,
      {
        returnDocument: "after", // It return new updated data/ after update data, without it DB will return old data or before value
        runValidators: true, // ensure only the selected values are updated as set in the mongoose Schma.
      },
    );
    return {
      success: true,
      data: updatedTicket,
    };
  }

  if (user.role === "agent" && ticket.assignedTo.toString() === user.id) {
    const allowedFields = ["status", "priority", "resolution"];

    const filteredData = {};

    for (const field of allowedFields) {
      if (updatedData[field] !== undefined) {
        filteredData[field] = updatedData[field];
      }
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      filteredData,
      {
        returnDocument: "after", // It return new updated data/ after update data, without it DB will return old data or before value
        runValidators: true, // ensure only the selected values are updated as set in the mongoose Schma.
      },
    );
    return {
      success: true,
      data: updatedTicket,
    };
  }

  return {
    success: false,
    reason: "FORBIDDEN",
  };
};

const replaceTicket = async (ticketid, ticketData) => {
  const replacedTicket = await Ticket.findOneAndReplace(
    { _id: ticketid },
    ticketData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return replacedTicket;
};

const deleteTicket = async (deleteId, user) => {
  const ticket = await Ticket.findById(deleteId);
  if (!ticket) {
    return {
      success: false,
      reason: "NOT_FOUND",
    };
  }
  if (user.role === "admin") {
    const deletedTicket = await Ticket.findByIdAndDelete(deleteId);

    return {
      success: true,
      data: deletedTicket,
    };
  }
  return {
    success: false,
    reason: "FORBIDDEN",
  };
};

// ------------------------------

const assignTicket = async (ticketId, agentId) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return {
      success: false,
      reason: "TICKET_NOT_FOUND",
    };
  }

  const agent = await User.findById(agentId);
  if (!agent) {
    return {
      success: false,
      reason: "AGENT_NOT_FOUND",
    };
  }

  if (agent.role !== "agent") {
    return {
      success: false,
      reason: "NOT_AN_AGENT",
    };
  }

  const update = { assignedTo: agentId };
  const assignedTicket = await Ticket.findByIdAndUpdate(ticketId, update, {
    returnDocument: "after",
    runValidators: true,
  }).populate("assignedTo", " firstName");

  return {
    success: true,
    data: assignedTicket,
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
};
