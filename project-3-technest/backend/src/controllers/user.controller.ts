import { Request, Response } from "express";
const userService = require("../services/user.service");

const userController = {
  userRegister: async (req: Request, res: Response) => {
    const response = await userService.userRegister(req.body);

    if (!response.success) {
      if (response.code === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(201).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  userLogin: async (req: Request, res: Response) => {
    const response = await userService.userLogin(req.body);

    if (!response.success) {
      if (
        response.code === "EMAIL_NOT_FOUND" ||
        response.code === "INCORRECT_PASSWORD"
      ) {
        return res.status(401).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    res.cookie("accessToken", response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data.userData,
    });
  },

  userProfile: async (req: Request, res: Response) => {
    const user = await userService.userProfile(req.user);

    if (!user.success) {
      if (user.code === "NOT_FOUND") {
        return res.status(404).json({
          success: user.success,
          message: user.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Fetched profile details successfully.",
      data: user.data,
    });
  },

  logoutCustomer: (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  },

  updateUserProfile: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const response = await userService.updateUserProfile(userId, {
      fullName: req.body.fullName,
      mobile: req.body.mobile,
    });

    return res.status(response.success ? 200 : 404).json(response);
  },

  changeUserPassword: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const response = await userService.changeUserPassword(
      userId,
      req.body.currentPassword,
      req.body.newPassword,
    );

    return res.status(response.success ? 200 : 400).json(response);
  },

  getAllCustomers: async (req: Request, res: Response) => {
  const response = await userService.getAllCustomers();

  return res.status(200).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
},

};

module.exports = userController;