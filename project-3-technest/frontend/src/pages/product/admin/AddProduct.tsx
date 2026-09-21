import { Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useAddProductMutation } from "../../../redux/api/productApi";

import {
  ProductForm,
  ProductFormData,
} from "../../../components/products/admin/ProductForm";

export const AddProduct = () => {
  const navigate = useNavigate();

  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleSubmit = async (productData: ProductFormData) => {
    try {
      const response = await addProduct(productData).unwrap();

      if (response.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Add Product
      </Heading>

      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
};
