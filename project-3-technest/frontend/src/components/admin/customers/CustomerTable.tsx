import {
  Box,
  Table,
} from "@chakra-ui/react";
import { User } from "../../../redux/api/userApi";



interface CustomerTableProps {
  customers: User[];
}

export const CustomerTable = ({
  customers,
}: CustomerTableProps) => {
  return (
    <Box
      overflowX="auto"
      bg="white"
      borderWidth="1px"
      borderRadius="lg"
    >
      <Table.Root variant="outline">
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

            <Table.ColumnHeader>
              Joined
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer._id}>
              <Table.Cell color="black">
                {customer.fullName}
              </Table.Cell>

              <Table.Cell color="black">
                {customer.email}
              </Table.Cell>

              <Table.Cell color="black">
                {customer.mobile}
              </Table.Cell>

              <Table.Cell color="black">
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