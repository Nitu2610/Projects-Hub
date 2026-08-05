const Ticket = require("../models/ticket.model");

const {
  buildFilter,
  buildSort,
  buildPagination,
} = require("../utils/ticketQuery.utils");

const createTicket = async (ticketData) => {
  const ticket = await Ticket.create(ticketData);

  return ticket;
};

const getAllTickets = async (query) => {
  const filter = buildFilter(query);
  const sort = buildSort(query);
  const { skip, limit } = buildPagination(query);

  return await Ticket.find(filter).sort(sort).skip(skip).limit(limit);
};

const getTicketById = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);

  return ticket;
};

const updateTicket = async (ticketId, updateData) => {
  const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
    returnDocument: "after", // It return new updated data/ after update data, without it DB will return old data or before value
    runValidators: true, // ensure only the selected values are updated as set in the mongoose Schma.
  });
  return updatedTicket;
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

const deleteTicket = async (ticketId) => {
  const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

  return deletedTicket;
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
