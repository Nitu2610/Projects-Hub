const agentStatusTransitions = {
  Open: ["In Progress"],
  "In Progress": ["Resolved"],
  Resolved: ["Closed"],
  Closed: [],
};


const isValidStatusTransition = (currentStatus, requestedStatus) => {
  if (!agentStatusTransitions[currentStatus]) return false;

  return agentStatusTransitions[currentStatus].includes(requestedStatus);
};

module.exports = isValidStatusTransition;