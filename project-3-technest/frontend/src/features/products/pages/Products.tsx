import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

import { useGetProductsQuery } from "../api/productApi";
import { useGetCategoriesQuery } from "../../categories/api/categoryApi";
import { Pagination } from "../../../components/shared/Pagination";
import { ProductFilters } from "../components/ProductFilters";
import { ProductsGrid } from "../components/ProductsGrid";
import { ErrorComp } from "../../../components/shared/ErrorComp";
import { useGetUserProfileQuery } from "../../customers/api/customerApi";
import {
  mapCustomerCategory,
} from "../../categories/utils/categoryMapper";



export const Products = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get("category") ?? "";

  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { data: categoryData } = useGetCategoriesQuery();


  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
  } = useGetProductsQuery({
    search: searchTerm || undefined,
    categoryId: categoryId || undefined,
    sort: sort || undefined,
    page,
  });

const rawCategories = categoryData?.data?.categories ?? [];

const categories = rawCategories.map(mapCustomerCategory);

const childCategories = categories.filter(
  (category) => category.parentId !== null
);

  const products = productsData?.data.products ?? [];

  const totalProducts =
    productsData?.data?.pagination?.total ?? products.length;

  const handleSearch = () => {
    setSearchTerm(search.trim());
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setPage(1);

    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  return (
    <Box
      bg="bg"
      minH="calc(100vh - 80px)"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="1400px">
        <VStack align="stretch" gap={8}>
          <Box>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              mb={2}
            >
              Products
            </Heading>

            <Text color="fg.muted">
              Explore our collection of electronics and technology
              products.
            </Text>
          </Box>

          <ProductFilters
            search={search}
            categoryId={categoryId}
            sort={sort}
            categories={childCategories}
            onSearchChange={setSearch}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
          />

          {!isLoading && !isError && (
            <Text fontSize="sm" color="fg.muted">
              {totalProducts}{" "}
              {totalProducts === 1 ? "product" : "products"} found
            </Text>
          )}

          {isLoading && <ProductsGrid isLoading />}

          {isError && (
            <ErrorComp message="Unable to load products. Please try again." />
          )}

          {!isLoading && !isError && (
            <Box position="relative">
              <ProductsGrid products={products} />

              {isFetching && (
                <Box
                  position="absolute"
                  inset="0"
                  bg="bg"
                  opacity={0.45}
                  pointerEvents="none"
                  borderRadius="xl"
                />
              )}
            </Box>
          )}

          {!isLoading &&
            !isError &&
            products.length > 0 && (
              <Pagination
                currentPage={
                  productsData?.data.pagination.page ?? 1
                }
                totalPages={
                  productsData?.data.pagination.totalPages ?? 1
                }
                onPageChange={setPage}
              />
            )}
        </VStack>
      </Container>
    </Box>
  );
};