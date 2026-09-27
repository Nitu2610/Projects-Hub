import type {
  AdminCategory,
  CategoryViewModel,
  CustomerCategory,
} from "../../../types/category.types";

export const mapAdminCategory = 
(category: AdminCategory): CategoryViewModel =>
   ({
  _id: category._id,
  name: category.name,
  active: category.active,
  parentId: category.parent?._id ?? null,
  parentName: category.parent?.name ?? null,
  productCount: category.productCount,
});

export const mapCustomerCategory = (
  category: CustomerCategory
): CategoryViewModel => ({
  _id: category._id,
  name: category.name,
  active: category.active,
  parentId: category.parent,
  parentName: null,
});