
// Filter and sort options used by the ticket list.
export const filterCompContent = {
  filterStatusContent: [
    { label: "All", value: "all" },
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Closed", value: "Closed" },
  ],
  filterPriorityContent: [
    { label: "All", value: "all" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
    { label: "Critical", value: "Critical" },
  ],
   filterSortContent: [
    { label: "All", value: "all" },
    { label: "Priority: Low -> High", value: 'priority-asc' },
    { label: "Priority: High -> Low", value: 'priority-desc' },
    { label: "Newest First", value: 'issueOccurredAt-desc' },
    { label: "Oldest First", value: 'issueOccurredAt-asc' },
  ],
};

