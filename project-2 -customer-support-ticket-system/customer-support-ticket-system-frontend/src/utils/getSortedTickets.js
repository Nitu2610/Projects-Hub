

export const getSortedTicket = (dataSet, sortValue) => {
  if (sortValue === "all") return dataSet;

  const sortedData = [...dataSet];

  switch (sortValue) {
    case "pl2h":
      return sortedData.sort((a, b) => a.priority - b.priority);

    case "ph2l":
      return sortedData.sort((a, b) => b.priority - a.priority);

    case "newestDate":
      return sortedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

    case "oldestDate":
      return sortedData.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      default : return sortedData;
  }
};
