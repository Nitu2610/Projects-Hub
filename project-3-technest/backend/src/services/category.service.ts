import type {
  CategoryData,
  UpdateCategoryData,
  UpdateCategoryStatusData,
} from "../types/category.types";

const Category = require("../models/category.model");

const isDuplicateKeyError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
};

const categoryService = {
  addCategory: async (categoryDetails: CategoryData) => {
    const normalizedName = categoryDetails.name.trim().toLowerCase();

    // Create parent category
    if (!categoryDetails.parent) {
      const existingCategory = await Category.findOne({
        normalizedName,
        parent: null,
      });

      if (existingCategory) {
        return {
          success: false,
          message: "Category already exists.",
          code: "ALREADY_EXIST",
        };
      }

      try {
        const newCategory = await Category.create({
          name: categoryDetails.name,
          normalizedName,
          parent: null,
        });

        return {
          success: true,
          message: "Parent category created successfully.",
          data: newCategory,
        };
      } catch (error: unknown) {
        if (isDuplicateKeyError(error)) {
          return {
            success: false,
            message: "Category already exists.",
            code: "ALREADY_EXIST",
          };
        }

        throw error;
      }
    }

    // Create child category
    const parentCategory = await Category.findById(categoryDetails.parent);

    if (!parentCategory) {
      return {
        success: false,
        message: "Parent category not found.",
        code: "PARENT_NOT_FOUND",
      };
    }

    if (!parentCategory.active) {
      return {
        success: false,
        message: "Parent category is inactive.",
        code: "PARENT_CATEGORY_INACTIVE",
      };
    }

    if (parentCategory.parent) {
      return {
        success: false,
        message: "A child category cannot have another child category.",
        code: "INVALID_PARENT",
      };
    }

    const existingCategory = await Category.findOne({
      normalizedName,
      parent: parentCategory._id,
    });

    if (existingCategory) {
      return {
        success: false,
        message: "Category already exists under the parent.",
        code: "ALREADY_EXIST",
      };
    }

    try {
      const newCategory = await Category.create({
        name: categoryDetails.name,
        normalizedName,
        parent: parentCategory._id,
      });

      return {
        success: true,
        message: "Category created successfully.",
        data: newCategory,
      };
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        return {
          success: false,
          message: "Category already exists under this parent.",
          code: "ALREADY_EXIST",
        };
      }

      throw error;
    }
  },

getCategories: async (
  role: string,
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

  const skip = (page - 1) * limit;

  // Guest + Customer
  // Only active categories are publicly visible.
  if (role === "guest" || role === "customer") {
    const pipeline = [
      {
        $match: {
          active: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "parent",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          active: 1,
          parent: {
            $cond: [
              { $eq: ["$parent", null] },
              null,
              {
                _id: {
                  $arrayElemAt: ["$parentCategory._id", 0],
                },
                name: {
                  $arrayElemAt: ["$parentCategory.name", 0],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $facet: {
          categories: [
            { $skip: skip },
            { $limit: limit },
          ],
          parentCategories: [
            {
              $match: {
                parent: null,
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                parent: 1,
              },
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

    const result = await Category.aggregate(pipeline);

    const categories = result[0]?.categories ?? [];
    const parentCategories = result[0]?.parentCategories ?? [];
    const total = result[0]?.totalCount[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message:
        categories.length === 0
          ? "No Category at present, need to add."
          : "Categories data fetched successfully.",
      data: {
        categories,
        parentCategories,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  }

  // Admin
  if (role === "admin") {
    const pipeline = [
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: {
            $size: "$products",
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "parent",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          active: 1,
          productCount: 1,
          parent: {
            $cond: [
              { $eq: ["$parent", null] },
              null,
              {
                _id: {
                  $arrayElemAt: ["$parentCategory._id", 0],
                },
                name: {
                  $arrayElemAt: ["$parentCategory.name", 0],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $facet: {
          categories: [
            { $skip: skip },
            { $limit: limit },
          ],
          parentCategories: [
            {
              $match: {
                parent: null,
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                active: 1,
                productCount: 1,
                parent: 1,
              },
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

    const result = await Category.aggregate(pipeline);

    const categories = result[0]?.categories ?? [];
    const parentCategories = result[0]?.parentCategories ?? [];
    const total = result[0]?.totalCount[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message:
        categories.length === 0
          ? "No Category at present, need to add."
          : "Categories data fetched successfully.",
      data: {
        categories,
        parentCategories,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  }

  return {
    success: false,
    message: "Invalid role.",
    code: "INVALID_ROLE",
  };
},

  updateCategory: async (updateCategory: UpdateCategoryData) => {
    const category = await Category.findById(updateCategory.categoryId);

    if (!category) {
      return {
        success: false,
        message: "Category not found to update.",
        code: "NOT_FOUND",
      };
    }

    const normalizedName = updateCategory.name.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      parent: category.parent,
      normalizedName,
      _id: { $ne: category._id },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "Category already exists under this parent.",
        code: "ALREADY_EXIST",
      };
    }

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        updateCategory.categoryId,
        {
          name: updateCategory.name,
          normalizedName,
        },
        { new: true, runValidators: true },
      );

      return {
        success: true,
        message: "Category details updated.",
        data: updatedCategory,
      };
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        return {
          success: false,
          message: "Category already exists under this parent.",
          code: "ALREADY_EXIST",
        };
      }

      throw error;
    }
  },

  updateCategoryStatus: async (
    updateCategoryStatus: UpdateCategoryStatusData,
  ) => {
    const category = await Category.findById(updateCategoryStatus.categoryId);

    if (!category) {
      return {
        success: false,
        message: "Category not found to update.",
        code: "NOT_FOUND",
      };
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      updateCategoryStatus.categoryId,
      {
        active: updateCategoryStatus.active,
      },
      { new: true, runValidators: true },
    );

    return {
      success: true,
      message: "Category status updated.",
      data: updatedCategory,
    };
  },
};

module.exports = categoryService;
