import { NativeSelect } from "@chakra-ui/react";

// AssignAgent:
// Providers the agent selection UI and sends the selected agent ID
// to the parent through the onAssign callback.

export const AssignAgent = ({ agents, assignedTo, onAssign }) => {
  // Show the currently assigned agent when one exists.
  const assignedAgentId = assignedTo?._id || "";

  const handleChange = (e) => {
    const agentId = e.target.value;

    if (agentId) {
      onAssign(agentId);
    }
  };
  return;
};
