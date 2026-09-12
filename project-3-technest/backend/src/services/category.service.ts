const Category = require("../models/category.model");

interface categoryData {
  name: string;
}

const categoryService = {
  addCategory: async (categoryName: categoryData) => {
    try {
      const normalizedName=categoryName.name.toLowerCase();
      // name convertion done, it can be used in searching and to add category

      const categoryExist = await Category.findOne({
        normalizedName,
      });

      if (categoryExist) {
        return {
          success: false,
          message: "Category already exists.",
          code: "ALREADY_EXIST",
        };
      }

      const newCategory = {
        name: categoryName.name,
        normalizedName: normalizedName,
      };

      const response = await Category.create(newCategory);

      return {
        success: true,
        message: "Category addedd successfully.",
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
  },
};

module.exports = categoryService;
