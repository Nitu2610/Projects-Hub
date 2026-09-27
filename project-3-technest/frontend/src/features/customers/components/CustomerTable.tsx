import { Box, Table, Text } from "@chakra-ui/react";
import { Customer } from "../../../types/customer.types";


interface CustomerTableProps {
  customers: Customer[];
}

export const CustomerTable = ({
  customers,
}: CustomerTableProps) => {
  return (
    <Box
      overflowX="auto"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
    >
      <Table.Root
        variant="outline"
        minW="750px"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              Name
            </Table.ColumnHeader>

            <Table.ColumnHeader>
              Email
            </Table.ColumnHeader>

            <Table.ColumnHeader>
              Mobile
            </Table.ColumnHeader>

            <Table.ColumnHeader textAlign="center">
              Joined
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer._id}>
              <Table.Cell>
                <Text fontWeight="medium">
                  {customer.fullName}
                </Text>
              </Table.Cell>

              <Table.Cell maxW="300px">
                <Text truncate>
                  {customer.email}
                </Text>
              </Table.Cell>

              <Table.Cell>
                {customer.mobile}
              </Table.Cell>

              <Table.Cell textAlign="center">
                {new Date(
                  customer.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};