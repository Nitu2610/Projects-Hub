import {
  Badge,
  Box,
  Button,
  Flex,
  Table,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUpdateCategoryStatusMutation } from "../api/categoryApi";
import { AdminCategory } from "../../../types/category.types";

interface CategoryTableProps {
  categories: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
}

export const CategoryTable = ({
  categories,
  onEdit,
}: CategoryTableProps) => {
  const [
    updateCategoryStatus,
    { isLoading },
  ] = useUpdateCategoryStatusMutation();

  const [
    updatingCategoryId,
    setUpdatingCategoryId,
  ] = useState<string | null>(null);

  const handleStatusChange = async (
    category: AdminCategory
  ) => {
    setUpdatingCategoryId(category._id);

    try {
      await updateCategoryStatus({
        id: category._id,
        active: !category.active,
      }).unwrap();
    } catch (error) {
      console.error(
        "Failed to update category status:",
        error
      );
    } finally {
      setUpdatingCategoryId(null);
    }
  };

 const getParentName = (parent: AdminCategory["parent"]) => {
  return parent?.name ?? "—";
};

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
              Parent
            </Table.ColumnHeader>

            <Table.ColumnHeader textAlign="center">
              Products
            </Table.ColumnHeader>

            <Table.ColumnHeader textAlign="center">
              Status
            </Table.ColumnHeader>

            <Table.ColumnHeader textAlign="center">
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category._id}>
              <Table.Cell>
                <Text fontWeight="medium">
                  {category.name}
                </Text>
              </Table.Cell>

              <Table.Cell color="fg.muted">
                {getParentName(category.parent)}
              </Table.Cell>

              <Table.Cell textAlign="center">
                {category.productCount}
              </Table.Cell>

              <Table.Cell textAlign="center">
                <Badge
                  colorPalette={
                    category.active
                      ? "green"
                      : "gray"
                  }
                  variant="subtle"
                >
                  {category.active
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Flex
                  justify="center"
                  gap={2}
                  flexWrap="wrap"
                >
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
                    colorPalette={
                      category.active
                        ? "red"
                        : "green"
                    }
                    loading={
                      isLoading &&
                      updatingCategoryId ===
                        category._id
                    }
                    onClick={() =>
                      handleStatusChange(category)
                    }
                  >
                    {category.active
                      ? "Deactivate"
                      : "Activate"}
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