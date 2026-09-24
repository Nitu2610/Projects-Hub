import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  AdminCategory,
  useGetCategoriesQuery,
} from "../../../redux/api/categoryApi";
import { CategoryForm } from "./CategoryForm";
import { CategoryTable } from "./CategoryTable";

export const AdminCategories = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    AdminCategory | undefined
  >(undefined);

  if (isLoading) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={3}>
          <Spinner size="lg" />
          <Text color="gray.500">Loading categories...</Text>
        </VStack>
      </Flex>
    );
  }

  if (isError || !data?.data) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <VStack gap={2}>
          <Heading size="md">Unable to load categories</Heading>
          <Text color="gray.500">
            Please try refreshing the page.
          </Text>
        </VStack>
      </Flex>
    );
  }

  const categories = data.data as AdminCategory[];

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: AdminCategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(undefined);
  };

  return (
    <Box color="black" p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={6} gap={4}>
        <Box>
          <Heading size="lg">Categories</Heading>
          <Text color="gray.500" mt={1}>
            Manage your store categories
          </Text>
        </Box>

        <Button onClick={handleAddCategory}>
          + Add Category
        </Button>
      </Flex>

      {categories.length === 0 ? (
        <Flex
          minH="250px"
          align="center"
          justify="center"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <Text color="gray.500">
            No categories available.
          </Text>
        </Flex>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEditCategory}
        />
      )}

      <CategoryForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        category={selectedCategory}
        parentCategories={categories}
      />
    </Box>
  );
};