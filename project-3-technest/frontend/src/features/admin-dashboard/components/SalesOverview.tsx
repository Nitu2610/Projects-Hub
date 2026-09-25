
import {
  Box,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Sale {
  date: string;
  revenue: number;
  orders: number;
}

interface SalesOverviewProps {
  data: Sale[];
}

export const SalesOverview = ({
  data,
}: SalesOverviewProps) => {

  const formatChartDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const chartData = data.map((item) => ({
  ...item,
  formattedDate: formatChartDate(item.date),
}));

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={5}
      boxShadow="sm"
      h="100%"
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="flex-start"
        mb={6}
      >
        <Box>
          <Heading size="md" color="gray.800">
            Sales Overview
          </Heading>

          <Text
            fontSize="sm"
            color="gray.500"
            mt={1}
          >
            Revenue over the last 7 days
          </Text>
        </Box>
      </Flex>

      {/* Chart */}
      <Box h="320px" w="100%">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `₹${(Number(value) / 100000).toFixed(1)}L`
              }
            />

            <Tooltip
              formatter={(value, name) => {
                if (name === "revenue") {
                  return [
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`,
                    "Revenue",
                  ];
                }

                return [
                  Number(value).toLocaleString("en-IN"),
                  "Orders",
                ];
              }}
              labelFormatter={(label) =>
                `Date: ${label}`
              }
            />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
