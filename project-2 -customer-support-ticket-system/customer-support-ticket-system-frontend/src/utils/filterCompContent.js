
// Filter and sort options used by the ticket list.
export const filterCompContent = {
  filterStatusContent: [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "inprogress" },
    { label: "Closed", value: "closed" },
  ],
  filterPriorityContent: [
    { label: "All", value: "all" },
    { label: "Low", value: 1 },
    { label: "Medium", value: 2 },
    { label: "High", value: 3 },
  ],
   filterSortContent: [
    { label: "All", value: "all" },
    { label: "Priority Low -> High", value: 'pl2h' },
    { label: "Priority High -> Low", value: 'ph2l' },
    { label: "Newest First", value: 'newestDate' },
     { label: "Oldest First", value: 'oldestDate' },
  ],
};
