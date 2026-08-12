const userService = require("../services/user.service");

const getAllUsers = async (req, res, next) => {
  const users = await userService.getAllUsers(req.user);

  if (!users.success) {
    if (users.reason === "FORBIDDEN") {
      return res.status(403).json({
        status: false,
        message: users.reason,
      });
    }
  }
  return res.status(200).json({
    status: true,
    messages: users.data.length === 0 ? "No Users" : "Users list fetched.",
    count: users.data.length,
    data: users.data,
  });
};

const createCustomer = async (req, res, next) => {
  const user = await userService.createUser(req.body, "customer");

  if (!user) {
    return res.status(409).json({
      status: false,
      message: "Email address already used.",
    });
  }

  const response = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  return res.status(201).json({
    status: true,
    message: "Customer is created successfully.",
    data: response,
  });
};

const createAgent = async (req, res, next) => {
  const user = await userService.createUser(req.body, "agent");

  if (!user) {
    return res.status(409).json({
      status: false,
      message: "Email address already used.",
    });
  }

  const response = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  return res.status(201).json({
    status: true,
    message: "Agent is created successfully.",
    data: response,
  });
};

const userLogin = async (req, res, next) => {
  const loginStatus = await userService.userLogin(req.body);

  if (loginStatus.reason === "Email_Not_Registered") {
    return res.status(404).json({
      status: false,
      message: "email is not registered!",
    });
  } else if (loginStatus.reason === "Incorrect_Password") {
    return res.status(401).json({
      status: false,
      message: "Incorrect password!",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Login Successfully",
    token: loginStatus.token,
    user: {
      id: loginStatus.user._id,
      firstName: loginStatus.user.firstName,
      role: loginStatus.user.role,
    },
  });
};

module.exports = {
  getAllUsers,
  createCustomer,
  createAgent,
  userLogin,
};
