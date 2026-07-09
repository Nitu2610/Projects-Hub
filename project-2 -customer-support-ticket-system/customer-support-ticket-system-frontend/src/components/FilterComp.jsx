import { Text, Box } from "@chakra-ui/react";

export const FilterComp = ({ value, onChange, content, heading }) => {
  return (
    <>
      <Box
        border="1px"
        borderColor="white"
        bg="white"
        p="8px 10px"
        display="flex"
        mt="10px"
      >
        <Text color="black">{heading} </Text>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)} // typeof (e.target.value) is string
          style={{ marginLeft: "5px", padding: "1px" }}
        >
          {content.map(({ label, value }) => {
            return (
              <option key={value} value={value} style={{ textAlign: "center" }}>
                {label}
              </option>
            );
          })}
        </select>
      </Box>
    </>
  );
};
