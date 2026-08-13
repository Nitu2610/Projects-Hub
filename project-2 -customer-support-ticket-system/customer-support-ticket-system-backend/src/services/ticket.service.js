const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

const {
  buildFilter,
  buildSort,
  buildPagination,
} = require("../utils/ticketQuery.utils");
const isValidStatusTransition = require("../utils/ticketWorkflow.utils");

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
    if (ticket.assignedTo && ticket.assignedTo._id.toString() === user.id) {
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

  const currentStatus = ticket.status;
  const requestedStatus = updatedData.status;
  const checkClientResolution = updatedData.resolution;

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

  if (
    user.role === "agent" &&
    ticket.assignedTo &&
    ticket.assignedTo.toString() === user.id
  ) {
    const allowedFields = ["status", "priority", "resolution"];
    
    
    if (
      requestedStatus &&
      !isValidStatusTransition(currentStatus, requestedStatus)
    ) {
      return {
        success: false,
        reason: "INVALID_STATUS_TRANSITION",
      };
    };
    
    const resolution =
    checkClientResolution !== undefined
    ? checkClientResolution
    : ticket.resolution;
    
    
    if (requestedStatus === "Resolved") {
      if (!resolution || !resolution.trim()) {
        return {
          success: false,
          reason: "RESOLUTION_REQUIRED",
        };
      }
    }

    const filteredData = {};

    for (const field of allowedFields) {
      if (updatedData[field] !== undefined) {
        filteredData[field] = updatedData[field];
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return {
        success: false,
        reason: "NO_VALID_FIELDS",
      };
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

const replaceTicket = async (ticketId, ticketData) => {
  const replacedTicket = await Ticket.findOneAndReplace(
    { _id: ticketId },
    ticketData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return replacedTicket;
};

const deleteTicket = async (ticketId, user) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return {
      success: false,
      reason: "NOT_FOUND",
    };
  }
  if (user.role === "admin") {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

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
  }).populate("assignedTo", "firstName");

  return {
    success: true,
    data: assignedTicket,
  };
};

const getDashboardStats = async () => {
  const totalTicketCount = await Ticket.countDocuments();

  const ticketByStatus = await Ticket.aggregate([
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

  const ticketByPriority = await Ticket.aggregate([
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

  const ticketByAgent = await Ticket.aggregate([
    {
      $group: {
        _id: "$assignedTo",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users", // which collection to search
        localField: "_id", // field in the current collection
        foreignField: "_id", // field in the other collection
        as: "agent", // name of the new field MongoDB creates
      },
    }, // Till now, we got unassigned ticket data,
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
  return { totalTicketCount, ticketByStatus, ticketByPriority, ticketByAgent };
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
