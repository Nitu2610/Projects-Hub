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

import { useGetProductsQuery } from "../redux/api/productApi";
import { useGetCategoriesQuery } from "../redux/api/categoryApi";
import { Pagination } from "../components/Pagination";
import { Link } from "react-router-dom";

const Products = () => {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { data: categoryData } = useGetCategoriesQuery();
  const { data, isLoading, isError } = useGetProductsQuery({
    search: searchTerm || undefined,
    categoryId: categoryId || undefined,
    sort: sort || undefined,
    page,
  });

  const childCategories = categoryData?.data.filter(
    (category) => category.parent !== null,
  );

  const handleSearch = () => {
    setSearchTerm(search.trim());
  };

  if (isLoading) {
    return <Text>Loading products...</Text>;
  }

  if (isError) {
    return <Text>Failed to load products.</Text>;
  }

  const products = data?.data.products ?? [];

  return (
    <Box p={6}>
      <Heading mb={6}>Products</Heading>

      <Box display="flex" gap={3} mb={6}>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Button onClick={handleSearch}>Search</Button>
      </Box>

      <select
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
      >
        <option value="">All Categories</option>

        {childCategories?.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(event) => setSort(event.target.value)}
        style={{ marginLeft: "20px" }}
      >
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

      {products.length === 0 ? (
        <Text>No products available.</Text>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          {products.map((product) => (
            <Link to={`/products/${product._id}`}  key={product._id} >
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
              >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.title}
                    width="100%"
                    height="200px"
                    objectFit="cover"
                  />
                )}

                <Box mt={4}>
                  <Text fontSize="sm" color="gray.500">
                    {product.category.name}
                  </Text>

                  <Heading size="md" mt={2}>
                    {product.title}
                  </Heading>

                  <Text mt={2} lineClamp={2}>
                    {product.description}
                  </Text>

                  <Box mt={3}>
                    {product.discountedPrice ? (
                      <>
                        <Text fontWeight="bold">
                          ₹{product.discountedPrice}
                        </Text>

                        <Text
                          textDecoration="line-through"
                          color="gray.500"
                          fontSize="sm"
                        >
                          ₹{product.price}
                        </Text>
                      </>
                    ) : (
                      <Text fontWeight="bold">₹{product.price}</Text>
                    )}
                  </Box>

                  <Badge mt={3}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </Box>
              </Box>
            </Link>
          ))}
        </Grid>
      )}

      <Pagination
        currentPage={data?.data.pagination.page ?? 1}
        totalPages={data?.data.pagination.totalPages ?? 1}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default Products;
