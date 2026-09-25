import mongoose from "mongoose";
import type {
  ProductData,
  UpdateProductData,
} from "../types/product.types";

const Product = require("../models/product.model");
const Category = require("../models/category.model");

interface ProductFilter {
  active?: boolean;
  category?: mongoose.Types.ObjectId;
  title?: {
    $regex: string;
    $options: string;
  };
}

interface SortStage {
  createdAt?: -1 | 1;
  effectivePrice?: -1 | 1;
}

const validateProductCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    return {
      success: false,
      message: "Category doesn't exist.",
      code: "NOT_FOUND",
    };
  }

  if (!category.parent) {
    return {
      success: false,
      message: "Product must belong to a child category.",
      code: "INVALID_CATEGORY",
    };
  }

  if (!category.active) {
    return {
      success: false,
      message: "Category is inactive.",
      code: "INACTIVE_CATEGORY",
    };
  }

  const parentCategory = await Category.findById(category.parent);

  if (!parentCategory) {
    return {
      success: false,
      message: "Parent category not found.",
      code: "NOT_FOUND",
    };
  }

  if (!parentCategory.active) {
    return {
      success: false,
      message: "Parent category is inactive.",
      code: "INACTIVE_CATEGORY",
    };
  }

  return {
    success: true,
    category,
    parentCategory,
  };
};

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const productService = {
  addProduct: async (productDetails: ProductData) => {
    const categoryValidation = await validateProductCategory(
      productDetails.category
    );

    if (!categoryValidation.success) {
      return categoryValidation;
    }

    if (
      typeof productDetails.discountedPrice === "number" &&
      productDetails.discountedPrice >= productDetails.price
    ) {
      return {
        success: false,
        message: "Discounted price must be lower than the product price.",
        code: "INCORRECT_DISCOUNTED_PRICE",
      };
    }

    const product = await Product.create(productDetails);

    return {
      success: true,
      message: "Product added successfully.",
      data: product,
    };
  },

  getProducts: async (
    role: string,
    categoryId?: string,
    search?: string,
    sort?: string,
    page: number = 1,
    limit: number = 10
  ) => {
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return {
        success: false,
        message: "Invalid pagination request.",
        code: "INVALID_REQUEST",
      };
    }

    const allowedSortValues = [
      "price_asc",
      "price_desc",
      "newest",
      "oldest",
    ];

    if (sort && !allowedSortValues.includes(sort)) {
      return {
        success: false,
        message: "Invalid sorting request.",
        code: "INVALID_REQUEST",
      };
    }

    const skip = (page - 1) * limit;

    let productFilter: ProductFilter = {};

    let sortStage: SortStage = {
      createdAt: -1,
    };

    if (role === "customer") {
      productFilter = {
        active: true,
      };
    } else if (role === "admin") {
      productFilter = {};
    } else {
      return {
        success: false,
        message: "You don't have authority to access this data.",
        code: "FORBIDDEN",
      };
    }

    if (sort === "price_asc") {
      sortStage = {
        effectivePrice: 1,
      };
    } else if (sort === "price_desc") {
      sortStage = {
        effectivePrice: -1,
      };
    } else if (sort === "newest") {
      sortStage = {
        createdAt: -1,
      };
    } else if (sort === "oldest") {
      sortStage = {
        createdAt: 1,
      };
    }

    if (categoryId) {
      const categoryValidation = await validateProductCategory(categoryId);

      if (!categoryValidation.success) {
        return categoryValidation;
      }

      productFilter.category = new mongoose.Types.ObjectId(categoryId);
    }

    if (search) {
      productFilter.title = {
        $regex: escapeRegex(search),
        $options: "i",
      };
    }

    const pipeline = [
      {
        $match: productFilter,
      },
      {
        $addFields: {
          effectivePrice: {
            $ifNull: ["$discountedPrice", "$price"],
          },
        },
      },
      {
        $sort: sortStage,
      },
      {
        $facet: {
          products: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ];

    const result = await Product.aggregate(pipeline);

    const productsData = result[0]?.products ?? [];

    const total = result[0]?.totalCount[0]?.total ?? 0;

    const totalPages = Math.ceil(total / limit);

    await Product.populate(productsData, {
      path: "category",
      select: "name",
    });

    return {
      success: true,
      message:
        productsData.length === 0
          ? "No product data available."
          : "Products data fetched successfully.",
      data: {
        products: productsData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  },

  getProductDetails: async (role: string, productId: string) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return {
        success: false,
        message: "Invalid product ID.",
        code: "INVALID_PRODUCT_ID",
      };
    }

    let productDetailsFilter: Record<string, unknown>;

    if (role === "customer") {
      productDetailsFilter = {
        _id: productId,
        active: true,
      };
    } else if (role === "admin") {
      productDetailsFilter = {
        _id: productId,
      };
    } else {
      return {
        success: false,
        message: "You don't have the authority to access this data.",
        code: "FORBIDDEN",
      };
    }

    const productDetails = await Product.findOne(
      productDetailsFilter
    ).populate("category", "name");

    if (!productDetails) {
      return {
        success: false,
        message: "Product not found.",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Product details fetched successfully.",
      data: productDetails,
    };
  },

  updateProduct: async (
    productId: string,
    productDetails: UpdateProductData
  ) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return {
        success: false,
        message: "Invalid product ID.",
        code: "INVALID_PRODUCT_ID",
      };
    }

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found.",
        code: "NOT_FOUND",
      };
    }

    if (productDetails.category) {
      const categoryValidation = await validateProductCategory(
        productDetails.category
      );

      if (!categoryValidation.success) {
        return categoryValidation;
      }
    }

    const finalPrice =
      productDetails.price ?? existingProduct.price;

    const finalDiscountedPrice =
      productDetails.discountedPrice ??
      existingProduct.discountedPrice;

    if (
      typeof finalDiscountedPrice === "number" &&
      finalDiscountedPrice >= finalPrice
    ) {
      return {
        success: false,
        message: "Discounted price must be lower than the product price.",
        code: "INCORRECT_DISCOUNTED_PRICE",
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: productDetails,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name");

    return {
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    };
  },

  deactivateProduct: async (productId: string) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return {
        success: false,
        message: "Invalid product ID.",
        code: "INVALID_PRODUCT_ID",
      };
    }

    const product = await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
        code: "NOT_FOUND",
      };
    }

    if (!product.active) {
      return {
        success: false,
        message: "Product is already inactive.",
        code: "ALREADY_INACTIVE",
      };
    }

    product.active = false;

    await product.save();

    return {
      success: true,
      message: "Product deactivated successfully.",
      data: product,
    };
  },
};

module.exports = productService;