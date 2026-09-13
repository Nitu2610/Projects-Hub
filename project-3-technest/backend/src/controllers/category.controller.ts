import { Request, Response } from "express";
const categoryService = require("../services/category.service");

const categoryController = {
  addCategory: async (req: Request, res: Response) => {
    const categoryAdded = await categoryService.addCategory({
      name: req.body.name,
      parent: req.body.parent,
    });

    if (!categoryAdded.success) {
      if (categoryAdded.code === "ALREADY_EXIST") {
        return res.status(409).json({
          success: categoryAdded.success,
          message: categoryAdded.message,
        });
      }
      if (categoryAdded.code === "PARENT_NOT_FOUND") {
        return res.status(404).json({
          success: categoryAdded.success,
          message: categoryAdded.message,
        });
      }
      if (categoryAdded.code === "PARENT_CATEGORY_INACTIVE") {
        return res.status(400).json({
          success: categoryAdded.success,
          message: categoryAdded.message,
        });
      }
      if (categoryAdded.code === "INVALID_PARENT") {
        return res.status(400).json({
          success: categoryAdded.success,
          message: categoryAdded.message,
        });
      }
    }
    return res.status(201).json({
      success: categoryAdded.success,
      message: categoryAdded.message,
      data: categoryAdded.data,
    });
  },

  getCategories: async (req: Request, res: Response) => {
    const role = req.user.role;

    const response = await categoryService.getCategories(role);

    if (!response.success) {
      if (response.code === "FORBIDDEN") {
        return res.status(403).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  updateCategory: async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await categoryService.updateCategory({
      categoryId: id,
      name: req.body.name,
    });

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
      if (response.code === "ALREADY_EXIST") {
        return res.status(409).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success:response.success,
      message:response.message,
      data:response.data
    })
  },

  updateCategoryStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await categoryService.updateCategoryStatus({
      categoryId: id,
      active: req.body.active,
    });

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success:response.success,
      message:response.message,
      data:response.data
    })
  },

};

module.exports = categoryController;
