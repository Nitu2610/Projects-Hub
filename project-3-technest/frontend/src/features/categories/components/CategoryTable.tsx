import { Box, Button, Flex, Table } from "@chakra-ui/react";
import { useState } from "react";
import {
  useUpdateCategoryStatusMutation,
} from "../api/categoryApi";
import { AdminCategory } from "../../../types/category.types";

interface CategoryTableProps {
  categories: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
}

export const CategoryTable = ({ categories, onEdit }: CategoryTableProps) => {
  const [updateCategoryStatus, { isLoading }] =
    useUpdateCategoryStatusMutation();

  const [updatingCategoryId, setUpdatingCategoryId] = useState<string | null>(
    null,
  );

  const handleStatusChange = async (category: AdminCategory) => {
    setUpdatingCategoryId(category._id);

    try {
      await updateCategoryStatus({
        id: category._id,
        active: !category.active,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update category status:", error);
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  return (
    <Box overflowX="auto" bg="white" borderWidth="1px" borderRadius="lg">
      <Table.Root variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Parent</Table.ColumnHeader>
            <Table.ColumnHeader>Products</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category._id}>
              <Table.Cell color="black">{category.name}</Table.Cell>

              <Table.Cell color="black">
                {category.parent ? category.parent.name : "—"}
              </Table.Cell>

              <Table.Cell color="black">{category.productCount}</Table.Cell>

              <Table.Cell color="black">
                {category.active ? "Active" : "Inactive"}
              </Table.Cell>

              <Table.Cell>
                <Flex gap={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(category)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    loading={isLoading && updatingCategoryId === category._id}
                    onClick={() => handleStatusChange(category)}
                  >
                    {category.active ? "Deactivate" : "Activate"}
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
