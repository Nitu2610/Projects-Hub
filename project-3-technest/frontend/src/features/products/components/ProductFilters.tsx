import {
  Box,
  Button,
  Flex,
  Input,
  NativeSelect,
} from "@chakra-ui/react";

import {
CategoryViewModel
} from "../../../types/category.types";

interface ProductFiltersProps {
  search: string;
  categoryId: string;
  sort: string;
  categories: CategoryViewModel[];
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const ProductFilters = ({
  search,
  categoryId,
  sort,
  categories,
  onSearchChange,
  onSearch,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) => {
  
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={3}
      width="100%"
      p={{ base: 4, md: 5 }}
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
    >
      {/* Search */}
      <Flex
        flex={{ base: "none", md: 2 }}
        gap={2}
        width="100%"
      >
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
        />

        <Button
          bg="primary"
          color="white"
          _hover={{ bg: "primary.hover" }}
          onClick={onSearch}
          flexShrink={0}
        >
          Search
        </Button>
      </Flex>

      {/* Category */}
      <Box width={{ base: "100%", md: "220px" }}>
        <NativeSelect.Root>
          <NativeSelect.Field
            aria-label="Filter by category"
            value={categoryId}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </NativeSelect.Field>

          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Box>

      {/* Sort */}
      <Box width={{ base: "100%", md: "220px" }}>
        <NativeSelect.Root>
          <NativeSelect.Field
            aria-label="Sort products"
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value)
            }
          >
            <option value="">Sort By</option>
            <option value="price_asc">
              Price: Low to High
            </option>
            <option value="price_desc">
              Price: High to Low
            </option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </NativeSelect.Field>

          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Box>
    </Flex>
  );
};