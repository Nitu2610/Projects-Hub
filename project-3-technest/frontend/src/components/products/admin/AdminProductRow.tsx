import { Button, Table } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import type { Product } from "../../../types/product.types";
import { DeactivateProductButton } from "../../../pages/product/admin/DeactivateProductButton";

interface AdminProductRowProps {
  product: Product;
  productIndex: number;
}

export const AdminProductRow = ({
  product,
  productIndex,
}: AdminProductRowProps) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/admin/products/${product._id}/edit`);
  };
  return (
    <Table.Row>
      <Table.Cell>{productIndex + 1}</Table.Cell>
      <Table.Cell>{product.title}</Table.Cell>

      <Table.Cell textAlign={"center"}>₹{product.price}</Table.Cell>

      <Table.Cell textAlign={"center"}>{product.stock}</Table.Cell>

      <Table.Cell textAlign={"center"}>
        {product.stock > 0 ? "Available" : "Out of Stock"}
      </Table.Cell>

      <Table.Cell textAlign={"center"}>
        {product.active ? "Active" : "Inactive"}
      </Table.Cell>

      <Table.Cell display={"flex"} justifyContent={"space-evenly"}>
        <Button size="sm" onClick={handleEdit}>
          Edit
        </Button>

        {product.active && (
          <DeactivateProductButton
            productId={product._id}
            productTitle={product.title}
          />
        )}
      </Table.Cell>
    </Table.Row>
  );
};
