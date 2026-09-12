import { Request, Response } from "express";
const categoryService = require("../services/category.service");

const categoryController = {
  addCategory: async (req: Request, res: Response) => {
    const categoryAdded = await categoryService.addCategory({name:req.body.name});

    if (!categoryAdded.success) {
      if (categoryAdded.code === "ALREADY_EXIST") {
        return res.status(409).json({
          success: categoryAdded.success,
          message: categoryAdded.message,
        });
      }
    }

    return res.status(201).json({
      success: categoryAdded.success,
      message: categoryAdded.message,
    });
  },
};


module.exports= categoryController;