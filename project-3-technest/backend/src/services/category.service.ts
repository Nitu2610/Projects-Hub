const Category = require("../models/category.model");

interface CategoryDataFormat {
  name: string;
  parent?: string | null;
}

interface DatabaseCategoryDataFormat {
  name: string;
  normalizedName: string;
  parent: string | null;
  active: boolean;
  _id?: string;
}

interface AdminCategoryDataFormat {
  _id: string;
  name: string;
  active: boolean;
  productCount: number;
  parent: {
    _id: string;
    name: string;
  } | null;
}
interface UpdateCategoryDataFormat {
  categoryId: string;
  name: string;
}
interface UpdateCategoryStatusDataFormat {
  categoryId: string;
  active: boolean;
}

const categoryService = {
  addCategory: async (categoryDetails: CategoryDataFormat) => {
    const normalizedName = categoryDetails.name.trim().toLowerCase();

    // Case 1: Create Parent Category

    if (!categoryDetails.parent) {
      const exisitingCategory = await Category.findOne({
        normalizedName,
        parent: null,
      });

      if (exisitingCategory) {
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
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          err.code === 11000
        ) {
          return {
            success: false,
            message: "Category already exists.",
            code: "ALREADY_EXIST",
          };
        }
        throw err;
      }
    }

    // Case 2: Create Child Category

    const parentCategory = await Category.findById(categoryDetails.parent);

    // Parent doesnt exist
    if (!parentCategory) {
      return {
        success: false,
        message: "Parent category not found.",
        code: "PARENT_NOT_FOUND",
      };
    }

    // Parent is inactive
    if (!parentCategory.active) {
      return {
        success: false,
        message: "Parent category is inactive",
        code: "PARENT_CATEGORY_INACTIVE",
      };
    }

    // Referenced category is itself a child
    if (parentCategory.parent) {
      return {
        success: false,
        message: "A childcategory cannot have another child category",
        code: "INVALID_PARENT",
      };
    }

    // check duplicate within the same parent and child category
    const existingCategory = await Category.findOne({
      normalizedName,
      parent: parentCategory._id,
    });

    if (existingCategory) {
      return {
        success: false,
        message: "Category already exists under the parent",
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
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === 11000
      ) {
        console.log(err);
        return {
          success: false,
          message: "Category already exists under this parent.",
          code: "ALREADY_EXIST",
        };
      }
      throw err;
    }
  },

  getCategories: async (role: string) => {
    let response: DatabaseCategoryDataFormat[] | AdminCategoryDataFormat[] = [];
    
    if (role === "customer") {
      const data = await Category.find({
        active: true,
      });
      response = data.map((item: DatabaseCategoryDataFormat) => ({
        _id: item._id,
        name: item.name,
        parent: item.parent,
      }));
    }
    if (role === "admin") {
      response = await Category.aggregate([
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
      ]);

      console.log(response);
    }

    if (response.length === 0) {
      return {
        success: true,
        message: "No Category at present, need to add.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Categories data fetched successfully.",
      data: response,
    };
  },

  updateCategory: async (updateCategory: UpdateCategoryDataFormat) => {
    try {
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
        parent: category.parent, // MongoDB search under one parent only i.e electronics.
        normalizedName,
        _id: { $ne: category._id }, // Find another category with this name, but ignore the category currently being updated.
      });

      if (existingCategory) {
        return {
          success: false,
          message: "Category already exists under this parent.",
          code: "ALREADY_EXIST",
        };
      }

      const response = await Category.findByIdAndUpdate(
        updateCategory.categoryId,
        {
          name: updateCategory.name,
          normalizedName,
        },
        { new: true },
      );

      return {
        success: true,
        message: "Category details updated.",
        data: response,
      };
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === 11000
      ) {
        return {
          success: false,
          message: "Category already exist under this parent.",
          code: "ALREADY_EXIST",
        };
      }
      throw err;
    }
  },

  updateCategoryStatus: async (
    updateCategoryStatus: UpdateCategoryStatusDataFormat,
  ) => {
    const category = await Category.findById(updateCategoryStatus.categoryId);

    if (!category) {
      return {
        success: false,
        message: "Category not found to update.",
        code: "NOT_FOUND",
      };
    }

    const response = await Category.findByIdAndUpdate(
      updateCategoryStatus.categoryId,
      {
        active: updateCategoryStatus.active,
      },
      { new: true },
    );

    return {
      success: true,
      message: "Category status updated.",
      data: response,
    };
  },
};

module.exports = categoryService;
