export const filterFieldResult = (
  userField,
  datasetField,
  datasetFieldValueDataType = "string",
) => {
  if (datasetFieldValueDataType === "number" && userField !== "all") {
    userField = Number(userField);
  }
  return (item) => {
    return userField === "all" ? true : item[datasetField] === userField;
  };
};
