import { Box, Text } from "@chakra-ui/react";

export const FilterComp = ({ value, onChange, content, heading }) => {
  return (
    <Box>
      <Text mb={1} fontSize="sm" fontWeight="medium" color="support.text">
        {heading}
      </Text>

      <Box
        bg="support.surface"
        color="support.text"
        border="1px solid"
        borderColor="support.border"
        borderRadius="md"
        px={2}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "inherit",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {content.map(({ label, value }) => (
            <option
              key={value}
              value={value}
              style={{
                backgroundColor: "white",
                color: "#0F172A",
              }}
            >
              {label}
            </option>
          ))}
        </select>
      </Box>
    </Box>
  );
};
