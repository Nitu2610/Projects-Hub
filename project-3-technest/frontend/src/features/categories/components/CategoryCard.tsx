import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  categoryId: string;
  name: string;
  productCount?: number;
}

export const CategoryCard = ({
  categoryId,
  name,
  productCount,
}: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?category=${categoryId}`);
  };
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      bg="bg.panel"
      p={5}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        borderColor: "primary",
        transform: "translateY(-2px)",
      }}
      onClick={handleClick}
    >
      <Stack gap={2}>
        <Heading size="sm">{name}</Heading>

        <Text fontSize="sm" color="fg.muted">
          {productCount} {productCount === 1 ? "product" : "products"}
        </Text>
      </Stack>
    </Box>
  );
};