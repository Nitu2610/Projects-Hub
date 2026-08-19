
// Creates a filter function for matching a field against the selected value.
export const filterFieldResult = (
  userField,
  datasetField,
  datasetFieldValueDataType = "string",
) => {
  // Convert the selected value when the dataset field uses number.
  if (datasetFieldValueDataType === "number" && userField !== "all") {
    userField = Number(userField);
  }
  return (item) => {
    return userField === "all" ? true : item[datasetField] === userField;
  };
};
