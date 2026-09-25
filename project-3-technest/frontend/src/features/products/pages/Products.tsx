import { useState } from "react";

import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  Badge,
  Input,
  Button,
} from "@chakra-ui/react";

import { useGetProductsQuery } from "../api/productApi";
import { useGetCategoriesQuery } from "../../categories/api/categoryApi";
import { Pagination } from "../../../components/shared/Pagination";
import { Link } from "react-router-dom";
import { ProductFilters } from "../components/ProductFilters";
import { ProductsGrid } from "../components/ProductsGrid";

const Products = () => {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { data: categoryData } = useGetCategoriesQuery();

  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetProductsQuery({
    search: searchTerm || undefined,
    categoryId: categoryId || undefined,
    sort: sort || undefined,
    page,
  });

  const childCategories =
    categoryData?.data.filter((category) => category.parent !== null) ?? [];

  const handleSearch = () => {
    setSearchTerm(search.trim());
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  if (isLoading) {
    return <Text>Loading products...</Text>;
  }

  if (isError) {
    return <Text>Failed to load products.</Text>;
  }

  const products = productsData?.data.products ?? [];
  return (
    <Box p={6}>
      <Heading mb={6}>Products</Heading>

      {/* Section 1: Search, Filter & Sort */}
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

      {/* Section 2: Products Grid */}
      <ProductsGrid products={products} />

      {/* Section 3: Pagination */}
      <Pagination
        currentPage={productsData?.data.pagination.page ?? 1}
        totalPages={productsData?.data.pagination.totalPages ?? 1}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default Products;
