const Ticket = require("../models/ticket.model");

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
  const ticket = await Ticket.findById(ticketId);

  if (!ticket)
    return {
      success: false,
      reason: "NOT_FOUND",
    };

  if (user.role === "customer") {
    if (ticket.createdBy.toString() === user.id) {
      return {
        success: true,
        data: ticket,
      };
    }
  }

  if (user.role === "agent") {
    if (ticket.assignedTo.toString() === user.id) {
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

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  replaceTicket,
  deleteTicket,
};

/**
 * 
 * {
  "_id": {
    "$oid": "6a5b882e924c385fc9628ca1"
  },
  "id": 1002,
  "title": "Unable to use the system",
  "decription": "Customer unable to utilize the system as it keeps on crashing.",
  "status": "In Progress",
  "priority": 3,
  "category": "System",
  "source": "Portal",
  "createdBy": "Bharu",
  "createdAt": "2026-07-012T10:30 00Z",
  "customer": {
    "id": " CUS201",
    "name": "Sharma Ji",
    "email": "sharma.ji@gmail.com",
    "company": "ZXC Techno Pvt. Ltm",
    "city": "Bengaluru"
  },
  "assignedTo": {
    "id": "EMP202",
    "name": "Bharath Kumar",
    "department": "Technical Support",
    "experience": 3
  },
  "tags": [
    "system crashes",
    "hangging",
    "urgent"
  ],
  "comments": [
    {
      "user": "Bharath Kumar",
      "message": "Requested customer to restat the system.",
      "createdAt": "2026-07-01T11:20 00Z"
    },
    {
      "user": "Solanki ",
      "message": " Issue reappeared.",
      "createdAt": " 2026-07-02T11:30:00Z"
    }
  ],
  "attachments": [
    {
      "fileName": "error- screenshot.jpg",
      "type": "image"
    },
    {
      "fileName": "browser-console-logs.text",
      "type": " text"
    },
    {
      "fileName": "console-logs.text",
      "type": " text"
    }
  ],
  "sla": {
    "targetHour": 48,
    "breached": false
  },
  "resolution": {
    "resolved": false,
    "resolvedBy": null,
    "resolvedAt": null,
    "resolutionTimeHours": null
  },
  "feedback": {
    "rating": null,
    "review": null
  },
  "history": [
    {
      "status": "Open",
      "changedAt": " 2026-07-01T10:40:00Z"
    },
    {
      "status": "In Progress",
      "changedAt": "2026-07-01T10:55:00Z"
    }
  ],
  "device": {
    "os": "Windows 11",
    "browser": "Chrome",
    "version": "138.01"
  },
  "estimatedCost": 350
}
 */
