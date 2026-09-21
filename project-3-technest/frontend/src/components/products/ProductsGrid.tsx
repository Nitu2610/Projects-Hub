import {
  Badge,
  Box,
  Grid,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface ProductImage {
  url: string;
  publicId: string;
}

interface ProductCategory {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  images: ProductImage[];
  category: ProductCategory;
}

interface ProductsGridProps {
  products: Product[];
}

export const ProductsGrid = ({ products }: ProductsGridProps) => {
  if (products.length === 0) {
    return <Text>No products available.</Text>;
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={6}
    >
      {products.map(product => (
        <Link to={`/products/${product._id}`} key={product._id}>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
          >
            {product.images?.length > 0 && (
              <Image
                src={product.images[0].url}
                alt={product.title}
                width="300px"
                height="200px"
                objectFit="contain"
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
                  <Text fontWeight="bold">
                    ₹{product.price}
                  </Text>
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
  );
};
