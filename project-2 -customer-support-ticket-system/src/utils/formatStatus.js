

export const formatStatus = (value) => {
  return value === "open"
            ? "Open"
            : value === "closed"
              ? "Closed"
              : "In Progress"
}
