import { Box, Button, Input } from "@chakra-ui/react";
import { CustomerCategory } from "../../../types/category.types";


interface ProductFiltersProps {
  search: string;
  categoryId: string;
  sort: string;
  categories: CustomerCategory[];
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
    <Box display="flex" gap={3} mb={6} flexWrap="wrap">
      <Box display="flex" gap={3}>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={event => onSearchChange(event.target.value)}
        />

        <Button onClick={onSearch}>
          Search
        </Button>
      </Box>

      <select
        value={categoryId}
        onChange={event => onCategoryChange(event.target.value)}
      >
        <option value="">All Categories</option>

        {categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={event => onSortChange(event.target.value)}
      >
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </Box>
  );
};

