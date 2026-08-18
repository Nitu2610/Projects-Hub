const userService = require("../services/user.service");

// Controller responsibility:
// Handle the HTTP request/ response for fetching users.
// Business rules and database operations remain inside the service layer.
const getAllUsers = async (req, res) => {
  const usersResult = await userService.getAllUsers();
  return res.status(200).json({
    success: usersResult.success,
    message:
      usersResult.data.length === 0
        ? "No users found."
        : "Users retrieved successfully.",
    count: usersResult.data.length,
    data: usersResult.data,
  });
};

// Customer registration controller.
// The controller determines the role because this endpoint is specifically
// designed for public customer registration.
const createCustomer = async (req, res) => {
  const userResult = await userService.createUser(req.body, "customer");

  if (!userResult.success) {
    if (userResult.code === "EMAIL_ALREADY_REGISTERED") {
      return res.status(409).json({
        success: userResult.success,
        message: userResult.message,
      });
    }
  }

  // Return only fields that are safe and necessary for the client.
  // The password is intentionaly excluded from teh response.
  const response = {
    id: userResult.data._id,
    firstName: userResult.data.firstName,
    lastName: userResult.data.lastName,
    email: userResult.data.email,
    role: userResult.data.role,
  };

  return res.status(201).json({
    success: userResult.success,
    message: userResult.message,
    data: response,
  });
};

// Admin-only agent creation controller.
// The route/middleware ensures that only an authenticated admin
// can reach this controller.
const createAgent = async (req, res) => {
  const userResult = await userService.createUser(req.body, "agent");

  if (!userResult.success) {
    if (userResult.code === "EMAIL_ALREADY_REGISTERED") {
      return res.status(409).json({
        success: userResult.success,
        message: userResult.message,
      });
    }
  }

  const response = {
    id: userResult.data._id,
    firstName: userResult.data.firstName,
    lastName: userResult.data.lastName,
    email: userResult.data.email,
    role: userResult.data.role,
  };

  return res.status(201).json({
    success: userResult.success,
    message: userResult.message,
    data: response,
  });
};

// Login controller.
// Responsible for translating authentication results from the service
// into appropriate HTTP status codes and the response sent to the client.
const userLogin = async (req, res) => {
  const loginResult = await userService.userLogin(req.body);

  if (!loginResult.success) {
    if (loginResult.code === "EMAIL_NOT_REGISTERED") {
      return res.status(404).json({
        success: loginResult.success,
        message: loginResult.message,
      });
    }

    if (loginResult.code === "INCORRECT_PASSWORD") {
      return res.status(401).json({
        success: loginResult.success,
        message: loginResult.message,
      });
    }
  }

  return res.status(200).json({
    success: loginResult.success,
    message: loginResult.message,
    data: {
      token: loginResult.data.token,
      id: loginResult.data.user._id,
      firstName: loginResult.data.user.firstName,
      role: loginResult.data.user.role,
    },
  });
};

module.exports = {
  getAllUsers,
  createCustomer,
  createAgent,
  userLogin,
};
