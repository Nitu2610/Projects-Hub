import type { Request, Response } from "express";

const adminDashboardService = require("../services/admin.dashboard.service");

const adminDashboardController = {
  getStats: async (req: Request, res: Response) => {
    const response =
      await adminDashboardService.getStats();

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },
};

module.exports = adminDashboardController;