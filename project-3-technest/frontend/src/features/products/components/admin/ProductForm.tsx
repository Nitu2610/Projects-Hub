import {
  Button,
  Field,
  Input,
  NativeSelect,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { Product, ProductImage } from "../../../../types/product.types";
import { useGetCategoriesQuery } from "../../../categories/api/categoryApi";
import { ProductImageUpload } from "./ProductImageUpload";

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: ProductFormData) => void;
  isLoading?: boolean;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  category: string;
  active: boolean;
  color?: string;
  specification?: Record<string, string>;
  images: ProductImage[];
}

interface SpecificationRow {
  key: string;
  value: string;
}

export const ProductForm = ({
  product,
  onSubmit,
  isLoading = false,
}: ProductFormProps) => {
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);

  const { data: categoryResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const categories = categoryResponse?.data ?? [];

  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    discountedPrice: product?.discountedPrice,
    stock: product?.stock ?? 0,
    category: product?.category?._id ?? "",
    active: product?.active ?? true,
    color: product?.color ?? "",
    specification: product?.specification ?? {},
    images: product?.images ?? [],
  });

  const [specifications, setSpecifications] = useState<SpecificationRow[]>([]);

  useEffect(() => {
    if (!product?.specification) {
      return;
    }

    const rows = Object.entries(product.specification).map(([key, value]) => ({
      key,
      value,
    }));

    setSpecifications(rows);
  }, [product]);

  const handleChange = (
    field: keyof ProductFormData,
    value: string | number | boolean,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSpecificationChange = (
    index: number,
    field: keyof SpecificationRow,
    value: string,
  ) => {
    setSpecifications((previous) =>
      previous.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  const addSpecification = () => {
    setSpecifications((previous) => [
      ...previous,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((previous) =>
      previous.filter((_, rowIndex) => rowIndex !== index),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const specification = specifications.reduce(
      (result, row) => {
        const key = row.key.trim();
        const value = row.value.trim();

        if (key && value) {
          result[key] = value;
        }

        return result;
      },
      {} as Record<string, string>,
    );

    if (images.length === 0) {
      console.error("At least one product image is required.");
      return;
    }

    onSubmit({
      ...formData,
      specification,
      images,
    });

    // console.log(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={5}>
        {/* Product Title */}
        <Field.Root>
          <Field.Label>Product Title</Field.Label>

          <Input
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
          />
        </Field.Root>

        {/* Description */}
        <Field.Root>
          <Field.Label>Description</Field.Label>

          <Textarea
            value={formData.description}
            onChange={(event) =>
              handleChange("description", event.target.value)
            }
          />
        </Field.Root>

        {/* Category */}
        <Field.Root>
          <Field.Label>Category</Field.Label>

          <NativeSelect.Root disabled={isCategoriesLoading}>
            <NativeSelect.Field
              value={formData.category}
              onChange={(event) => handleChange("category", event.target.value)}
            >
              <option value="">Select category</option>

              {categories
                .filter((category) => category.active)
                .map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </NativeSelect.Field>

            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        {/* Price */}
        <Field.Root>
          <Field.Label>Price</Field.Label>

          <Input
            type="number"
            value={formData.price}
            onChange={(event) =>
              handleChange("price", Number(event.target.value))
            }
          />
        </Field.Root>

        {/* Discounted Price */}
        <Field.Root>
          <Field.Label>Discounted Price</Field.Label>

          <Input
            type="number"
            value={formData.discountedPrice ?? ""}
            onChange={(event) =>
              handleChange("discountedPrice", Number(event.target.value))
            }
          />
        </Field.Root>

        {/* Stock */}
        <Field.Root>
          <Field.Label>Stock</Field.Label>

          <Input
            type="number"
            min={0}
            value={formData.stock}
            onChange={(event) =>
              handleChange("stock", Number(event.target.value))
            }
          />
        </Field.Root>

        {/* Color */}
        <Field.Root>
          <Field.Label>Color</Field.Label>

          <Input
            value={formData.color}
            onChange={(event) => handleChange("color", event.target.value)}
          />
        </Field.Root>

        {/* Image Upload */}
        <Field.Root>
          <Field.Label>Product Images</Field.Label>

          <ProductImageUpload images={images} onImagesChange={setImages} />
        </Field.Root>

        {/* Specifications */}
        <Field.Root>
          <Field.Label>Specifications</Field.Label>

          <Stack gap={3}>
            {specifications.map((specification, index) => (
              <Stack key={index} direction="row" gap={3}>
                <Input
                  placeholder="Property"
                  value={specification.key}
                  onChange={(event) =>
                    handleSpecificationChange(index, "key", event.target.value)
                  }
                />

                <Input
                  placeholder="Value"
                  value={specification.value}
                  onChange={(event) =>
                    handleSpecificationChange(
                      index,
                      "value",
                      event.target.value,
                    )
                  }
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeSpecification(index)}
                >
                  Remove
                </Button>
              </Stack>
            ))}

            <Button type="button" variant="outline" onClick={addSpecification}>
              + Add Specification
            </Button>
          </Stack>
        </Field.Root>

        {/* Activate/Deactivate */}
        <Field.Root>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={formData.active ? "true" : "false"}
              onChange={(event) =>
                handleChange("active", event.target.value === "true")
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        <Button type="submit" loading={isLoading}>
          {product ? "Update Product" : "Add Product"}
        </Button>
      </Stack>
    </form>
  );
};
