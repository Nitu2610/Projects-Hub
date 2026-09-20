import { Table } from "@chakra-ui/react";

import type { Product } from "../../../types/product.types";
import { AdminProductRow } from "./AdminProductRow";

interface AdminProductTableProps {
  products: Product[];
}

export const AdminProductTable = ({ products }: AdminProductTableProps) => {
  return (
    <Table.Root variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader textAlign={"center"}>S No</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"center"}>Product</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"center"}>Price</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"center"}>Stock</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"center"}>
            Availability
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"center"}>Active</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={"center"}>Action</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {products.map((product, index) => (
          <AdminProductRow
            key={product._id}
            product={product}
            productIndex={index}
          />
        ))}
      </Table.Body>
    </Table.Root>
  );
};
