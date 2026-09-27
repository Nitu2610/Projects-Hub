import {
  Badge,
  Box,
  Grid,
  Heading,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Product } from "../../../types/product.types";

interface ProductsGridProps {
  products?: Product[];
  isLoading?: boolean;
}

export const ProductsGrid = ({
  products = [],
  isLoading = false,
}: ProductsGridProps) => {
  if (isLoading) {
    return (
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={{ base: 4, md: 6 }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            overflow="hidden"
            bg="bg.panel"
          >
            <Skeleton height={{ base: "200px", md: "220px" }} />

            <Stack p={5} gap={3}>
              <Skeleton height="14px" width="35%" />
              <Skeleton height="22px" />
              <Skeleton height="16px" width="80%" />
              <Skeleton height="16px" width="55%" />
            </Stack>
          </Box>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        bg="bg.panel"
        textAlign="center"
        py={{ base: 12, md: 16 }}
        px={6}
      >
        <Heading size="md" mb={2}>
          No products found
        </Heading>

        <Text color="fg.muted">
          Try changing your search, category, or sorting options.
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={{ base: 4, md: 6 }}
    >
      {products.map((product) => {
        const hasDiscount =
          product.discountedPrice !== undefined &&
          product.discountedPrice !== null &&
          product.discountedPrice < product.price;

        const isInStock = product.stock > 0;

        return (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            style={{ display: "block" }}
            aria-label={`View ${product.title}`}
          >
            <Box
              height="100%"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              overflow="hidden"
              bg="bg.panel"
              transition="all 0.2s ease"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "lg",
                borderColor: "primary",
              }}
            >
              {/* Product Image */}
              <Box
                height={{ base: "200px", md: "220px" }}
                bg="bg.muted"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                {product.images?.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    p={4}
                  />
                ) : (
                  <Text
                    color="fg.muted"
                    fontSize="sm"
                  >
                    No image available
                  </Text>
                )}
              </Box>

              {/* Product Information */}
              <Stack p={5} gap={3}>
                <Text
                  fontSize="sm"
                  color="fg.muted"
                  fontWeight="500"
                >
                  {product.brand}
                </Text>

                <Heading
                  size="md"
                  mt={1}
                  lineClamp={2}
                >
                  {product.title}
                </Heading>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                  lineClamp={2}
                  minH="40px"
                >
                  {product.description}
                </Text>

                {/* Price */}
                <Box>
                  {hasDiscount ? (
                    <Stack
                      direction="row"
                      align="center"
                      gap={2}
                    >
                      <Text
                        fontWeight="700"
                        fontSize="lg"
                      >
                        ₹{product.discountedPrice}
                      </Text>

                      <Text
                        textDecoration="line-through"
                        color="fg.muted"
                        fontSize="sm"
                      >
                        ₹{product.price}
                      </Text>
                    </Stack>
                  ) : (
                    <Text
                      fontWeight="700"
                      fontSize="lg"
                    >
                      ₹{product.price}
                    </Text>
                  )}
                </Box>

                {/* Stock */}
                <Badge
                  width="fit-content"
                  colorPalette={isInStock ? "green" : "red"}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </Stack>
            </Box>
          </Link>
        );
      })}
    </Grid>
  );
};