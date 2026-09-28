import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

import { useGetCategoriesQuery } from "../api/categoryApi";
import { CategoryCard } from "../components/CategoryCard";
import { useGetUserProfileQuery } from "../../customers/api/customerApi";
import {
  mapAdminCategory,
  mapCustomerCategory,
} from "../utils/categoryMapper";
import {
  AdminCategory,
  CustomerCategory,
} from "../../../types/category.types";
import { Pagination } from "../../../components/shared/Pagination";

export const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categoryData,
    isLoading,
    isError,
  } = useGetCategoriesQuery({
    page: currentPage,
    limit: 10,
  });

  const { data: userData } = useGetUserProfileQuery();

  const role = userData?.data?.role;

  const categoriesData = categoryData?.data;

  const rawCategories = categoriesData?.categories ?? [];

  const categories =
    role === "admin"
      ? (rawCategories as AdminCategory[]).map(mapAdminCategory)
      : (rawCategories as CustomerCategory[]).map(mapCustomerCategory);

  const parentCategories = categoriesData?.parentCategories ?? [];

  const pagination = categoriesData?.pagination;

  if (isLoading) {
    return (
      <Container maxW="1200px" py={10}>
        <Text>Loading categories...</Text>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="1200px" py={10}>
        <Text color="error">
          Unable to load categories. Please try again.
        </Text>
      </Container>
    );
  }

  return (
    <Box bg="bg" minH="calc(100vh - 80px)" py={{ base: 6, md: 10 }}>
      <Container maxW="1200px">
        <Stack gap={{ base: 8, md: 10 }}>
          <Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>
              Categories
            </Heading>

            <Text mt={2} color="fg.muted">
              Browse products by category.
            </Text>
          </Box>

          {parentCategories.length === 0 ? (
            <Text color="fg.muted">
              No categories available.
            </Text>
          ) : (
            <Stack gap={10}>
              {parentCategories.map((parent) => {
                const childCategories = categories.filter(
                  (category) => category.parentId === parent._id
                );

                return (
                  <Box key={parent._id}>
                    <Heading size="lg" mb={5}>
                      {parent.name}
                    </Heading>

                    {childCategories.length === 0 ? (
                      <Text color="fg.muted">
                        No products available in this category.
                      </Text>
                    ) : (
                      <SimpleGrid
                        columns={{
                          base: 1,
                          sm: 2,
                          md: 3,
                          lg: 4,
                        }}
                        gap={5}
                      >
                        {childCategories.map((category) => (
                          <CategoryCard
                            key={category._id}
                            categoryId={category._id}
                            name={category.name}
                            productCount={category.productCount}
                          />
                        ))}
                      </SimpleGrid>
                    )}
                  </Box>
                );
              })}
            </Stack>
          )}

          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
};