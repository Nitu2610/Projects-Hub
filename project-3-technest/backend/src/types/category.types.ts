import type { Types } from "mongoose";

export interface CategoryData {
  name: string;
  parent?: string | null;
}

export interface CustomerCategory {
  _id: string;
  name: string;
  active: boolean;
  parent: Types.ObjectId | null;
}

export interface AdminCategory {
  _id: string;
  name: string;
  active: boolean;
  productCount: number;
  parent: {
    _id: string;
    name: string;
  } | null;
}

export interface UpdateCategoryData {
  categoryId: string;
  name: string;
}

export interface UpdateCategoryStatusData {
  categoryId: string;
  active: boolean;
}