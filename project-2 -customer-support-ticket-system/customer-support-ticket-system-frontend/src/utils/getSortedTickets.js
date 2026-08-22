

// Sort the ticket list based on the selected sort option.
export const getSortedTicket = (dataSet, sortValue) => {
  if (sortValue === "all") return dataSet;

  // Copy the array so the original ticket list is not modified.
  const sortedData = [...dataSet];

  switch (sortValue) {
    case "pl2h":
      return sortedData.sort((a, b) => a.priority - b.priority);

    case "ph2l":
      return sortedData.sort((a, b) => b.priority - a.priority);

    case "newestDate":
      return sortedData.sort(
        (a, b) => new Date(b.issueOccurredAt) - new Date(a.issueOccurredAt),
      );

    case "oldestDate":
      return sortedData.sort(
        (a, b) => new Date(a.issueOccurredAt) - new Date(b.issueOccurredAt),
      );
      default : return sortedData;
  }
};
