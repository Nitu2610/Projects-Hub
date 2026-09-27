import { Badge, Button, HStack, Table, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/product.types";
import { DeactivateProductButton } from "./DeactivateProductButton";

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
      <Table.Cell textAlign="center">
        {productIndex + 1}
      </Table.Cell>

      <Table.Cell maxW="320px">
        <Text fontWeight="medium" truncate>
          {product.title}
        </Text>
      </Table.Cell>

      <Table.Cell textAlign="center">
        ₹{product.price.toLocaleString("en-IN")}
      </Table.Cell>

      <Table.Cell textAlign="center">
        {product.stock}
      </Table.Cell>

      <Table.Cell textAlign="center">
        <Badge
          colorPalette={product.stock > 0 ? "green" : "red"}
          variant="subtle"
        >
          {product.stock > 0 ? "Available" : "Out of Stock"}
        </Badge>
      </Table.Cell>

      <Table.Cell textAlign="center">
        <Badge
          colorPalette={product.active ? "green" : "gray"}
          variant="subtle"
        >
          {product.active ? "Active" : "Inactive"}
        </Badge>
      </Table.Cell>

      <Table.Cell>
        <HStack justify="center" gap={2}>
          <Button size="sm" variant="outline" onClick={handleEdit}>
            Edit
          </Button>

          {product.active && (
            <DeactivateProductButton
              productId={product._id}
              productTitle={product.title}
            />
          )}
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
};