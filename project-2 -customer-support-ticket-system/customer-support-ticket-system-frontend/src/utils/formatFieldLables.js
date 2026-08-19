// Maps the stored priority value to the lable shown in the UI.
const priorityMap = {
  1: "Low",
  2: "Medium",
  3: "High",
};

// Converts the stored status value into a user-friendly lable.
const formatStatus = (value) => {
  return value === "open"
    ? "Open"
    : value === "closed"
      ? "Closed"
      : "In Progress";
};

const formatPriority = (key) => {
  return priorityMap[key];
};

export { formatPriority, formatStatus };
