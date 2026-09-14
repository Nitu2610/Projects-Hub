const Product = require("../models/product.model");
const Category = require("../models/category.model");

console.log(Product);

interface Specification {
  [key: string]: string;
}

interface ProductDataFormat {
  title: string;
  description: string;
  image?: string;
  color?: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  specification: Specification;
  category: string;
}

interface ProductFilterDataFormat {
  active?: boolean;
  category?: string;
  title?: { $regex: string; $options: string };
  price?: number;
  stock?: number;
}

const productService = {
  addProduct: async (productDetails: ProductDataFormat) => {
    try {
      // 1. Check whether the selected category exists
      const category = await Category.findById(productDetails.category);

      if (!category) {
        return {
          success: false,
          message: "Category doesn't exist.",
          code: "NOT_FOUND",
        };
      }

      // 2. Product must belong to a child category
      if (!category.parent) {
        return {
          success: false,
          message: "Incorrect category selected.",
          code: "INVALID_CATEGORY",
        };
      }

      // 3. Child category must be active
      if (!category.active) {
        return {
          success: false,
          message: "Category is inactive.",
          code: "INACTIVE_CATEGORY",
        };
      }

      // 4. Find the parent category
      const parentCategory = await Category.findById(category.parent);

      if (!parentCategory) {
        return {
          success: false,
          message: "Parent category not found.",
          code: "NOT_FOUND",
        };
      }

      // 5. Parent category must be active
      if (!parentCategory.active) {
        return {
          success: false,
          message: "Parent category is inactive.",
          code: "INACTIVE_CATEGORY",
        };
      }

      // 6. Validate discounted price
      if (
        typeof productDetails.discountedPrice === "number" &&
        (productDetails.discountedPrice <= 0 ||
          productDetails.discountedPrice >= productDetails.price)
      ) {
        return {
          success: false,
          message: "Discounted price is incorrect.",
          code: "INCORRECT_DISCOUNTED_PRICE",
        };
      }

      // 7. Create product
      const response = await Product.create(productDetails);

      // 8. Return successful response
      return {
        success: true,
        message: "Product added successfully.",
        data: response,
      };
    } catch (err) {
      throw err;
    }
  },

  getProducts: async (
    role: string,
    categoryId?: string,
    search?: string,
    sort?: string,
  ) => {
    let productFilter: ProductFilterDataFormat = {};
    let sortStage: {
      createdAt?: -1 | 1;
      effectivePrice?: -1 | 1;
    } = {
      createdAt: -1,
    };
    const allowedSortValue = ["price_asc", "price_desc", "newest", "oldest"];

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
    if (sort && !allowedSortValue.includes(sort)) {
      return {
        success: false,
        message: "Invalid sorting request.",
        code: "INVALID_SORT",
      };
    }

    if (role === "customer") {
      productFilter = { active: true };
    } else if (role === "admin") {
      productFilter = {};
    } else {
      return {
        success: false,
        message: "You don't have authority to access this data.",
        code: "FORBIDDEN",
      };
    }

    if (categoryId) {
      const existingCategory = await Category.findOne({
        _id: categoryId,
        active: true,
      });
      if (!existingCategory) {
        return {
          success: false,
          message: "Category doesn't exist.",
          code: "NOT_FOUND",
        };
      }
      if (!existingCategory.parent) {
        return {
          success: false,
          message: "Product can't be filtered with parent category",
          code: "INVALID_CATEGORY",
        };
      }

      const parentCategory = await Category.findOne({
        _id: existingCategory.parent,
        active: true,
      });
      if (!parentCategory) {
        return {
          success: false,
          message: "Parent category is inactive ",
          code: "INACTIVE_CATEGORY",
        };
      }

      productFilter.category = categoryId;
    }

    if (search) {
      productFilter.title = { $regex: search, $options: "i" };
    }

    const pipeline = [
      {
        $match: productFilter, // This is basically the aggregation equivalent of: Product.find(productFilter)
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
    ];

    const productsData = await Product.aggregate(pipeline);

    await Product.populate(productsData, { path: "category", select: "name" });

    return {
      success: true,
      message:
        productsData.length === 0
          ? "No product data available."
          : "Products data fetched successfully.",
      data: productsData,
    };
  },
};

module.exports = productService;
