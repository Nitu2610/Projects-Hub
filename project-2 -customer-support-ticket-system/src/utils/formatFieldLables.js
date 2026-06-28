
const priorityMap={
  1:"Low", 2:"Medium", 3:"High"
}

const formatStatus = (value) => {
  return value === "open"
            ? "Open"
            : value === "closed"
              ? "Closed"
              : "In Progress"
}




 const formatPriority = (key) => {
  return priorityMap[key]
}

export {formatPriority, formatStatus};