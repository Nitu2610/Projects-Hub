const userService = require("../services/user.service");

const userController = {
  registerCustomer: async (req, res) => {
    const response = await userService.registerCustomer(req.body);

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

  loginCustomer: async (req, res) => {
    const response = await userService.loginCustomer(req.body);

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

  customerProfile: async (req, res) => {
    const user = await userService.customerProfile(req.user);

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

  logoutCustomer:  (req, res) => {
    res.clearCookie("accessToken", {
     httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Customer logout successfully.",
    });
  },
};

module.exports = userController;
