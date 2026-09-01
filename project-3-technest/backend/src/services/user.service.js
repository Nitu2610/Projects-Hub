const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userService = {
  registerCustomer: async (userData) => {
    try {
      const existsEmail = await User.findOne({ email: userData.email });

      if (existsEmail) {
        return {
          success: false,
          message: "Email already registered!",
          code: "EMAIL_ALREADY_EXISTS",
        };
      }

      const hashPassword = await bcrypt.hash(
        userData.password,
        Number(process.env.BCRYPT_SALT_ROUNDS) || 8,
      );
      const newUser = {
        fullName: userData.fullName,
        email: userData.email,
        password: hashPassword,
        mobile: userData.mobile,
        role: "customer",
      };

      const response = await User.create(newUser);

      const { password, ...safeData } = response.toObject();

      return {
        success: true,
        message: "Customer registered successfully.",
        data: safeData,
      };
    } catch (err) {
      if (err.code === 11000) {
        if (err.keyPattern.email) {
          return {
            success: false,
            message: "Email already registered!",
            code: "EMAIL_ALREADY_EXISTS",
          };
        }
      }
      throw err;
    }
  },

  loginCustomer: async (userCreds) => {
    const user = await User.findOne({ email: userCreds.email }).select(
      "+password",
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
        code: "EMAIL_NOT_FOUND",
      };
    }

    const matchPassword = await bcrypt.compare(
      userCreds.password,
      user.password,
    );

    if (!matchPassword) {
      return {
        success: false,
        message: "Invalid email or password.",
        code: "INCORRECT_PASSWORD",
      };
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    const safeData = {
      token,
      userData: {
        role: user.role,
        name: user.fullName,
        userId: user._id,
      },
    };

    return {
      success: true,
      message: "Login successful.",
      data: safeData,
    };
  },

  customerProfile: async ({userId}) => {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return {
        success: false,
        message: "Profile details not found.",
        code: "NOT_FOUND",
      };
    }

    const { password, ...safeData } = user.toObject();

    return {
      success: true,
      message: "Successfully found the profile details.",
      data: safeData,
    };
  },
};

module.exports = userService;
