import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useGetCategoriesQuery } from "../../../features/categories/api/categoryApi";
import { AdminCategory } from "../../../types/category.types";
import { CategoryTable } from "../components/CategoryTable";
import { CategoryForm } from "../components/CategoryForm";
import { LoadingComp } from "../../../components/shared/LoadingComp";
import { ErrorComp } from "../../../components/shared/ErrorComp";
import { Pagination } from "../../../components/shared/Pagination";

export const AdminCategories = () => {
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | undefined>(undefined);

  const {
    data,
    isLoading,
    isError,
  } = useGetCategoriesQuery({
    page,
    limit: 10,
  });

  if (isLoading) return <LoadingComp />;

  if (isError || !data?.data) {
    return (
      <ErrorComp message="Unable to load categories. Please try again." />
    );
  }

  const { categories, parentCategories, pagination } =
  data.data as {
    categories: AdminCategory[];
    parentCategories: AdminCategory[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };

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
    <Box bg="bg" minH="100vh" py={{ base: 5, md: 8 }}>
      <Container maxW="1400px">
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={4}
          mb={6}
        >
          <Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>
              Categories
            </Heading>

            <Text mt={1} color="fg.muted">
              Manage your store categories.
            </Text>
          </Box>

          <Button
            width={{ base: "100%", sm: "auto" }}
            onClick={handleAddCategory}
          >
            + Add Category
          </Button>
        </Flex>

        {categories.length === 0 ? (
          <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            textAlign="center"
          >
            <Heading size="md">No categories available</Heading>

            <Text mt={2} color="fg.muted">
              Add a category to start organizing your products.
            </Text>
          </Box>
        ) : (
          <>
            <CategoryTable
              categories={categories}
              onEdit={handleEditCategory}
            />

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}

        <CategoryForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          category={selectedCategory}
          parentCategories={parentCategories}
        />
      </Container>
    </Box>
  );
};