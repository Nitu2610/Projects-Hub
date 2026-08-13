const { updateMany } = require("../models/ticket.model");

const allowedAgentTransitions = {
  Open: ["In Progress"],
  "In Progress": ["Resolved"],
  Resolved: ["Closed"],
  Closed: [],
};

const isValidStatusTransition = (currentStatus, requestedStatus) => {
  if (!allowedAgentTransitions[currentStatus]) return false;

  return allowedAgentTransitions[currentStatus].includes(requestedStatus);
};

module.exports = isValidStatusTransition;
