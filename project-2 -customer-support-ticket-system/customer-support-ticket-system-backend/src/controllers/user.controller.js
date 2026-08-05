const userService = require("../services/user.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    if (users.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No Users",
        count: 0,
        data: users,
      });
    }

    return res.status(200).json({
      status: true,
      messages: "Users list fetched.",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

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
      message: "User is created successfully.",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
