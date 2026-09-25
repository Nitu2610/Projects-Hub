import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthPayload } from "../types/auth.types";
import {
  ChangeUserPasswordData,
  LoginCredentials,
  RegisterUserData,
  UpdateUserProfileData,
} from "../types/user.types";
const User = require("../models/user.model");

const userService = {
  userRegister: async (userData: RegisterUserData) => {
    try {
      const existsEmail = await User.findOne({ email: userData.email });

      if (existsEmail) {
        return {
          success: false,
          message: "Email already registered!",
          code: "EMAIL_ALREADY_EXISTS",
        };
      }

      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 8;
      const newPassword = userData.password;

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const newUser = {
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
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
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        "keyPattern" in err &&
        (err as { code?: number }).code === 11000 &&
        (err as { keyPattern?: { email?: unknown } }).keyPattern?.email
      ) {
        return {
          success: false,
          message: "Email already registered!",
          code: "EMAIL_ALREADY_EXISTS",
        };
      }

      throw err;
    }
  },

  userLogin: async (userCreds: LoginCredentials) => {
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

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET_KEY is missing.");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecretKey,
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

  userProfile: async ({ userId }: AuthPayload) => {
    const user = await User.findById(userId);
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

  updateUserProfile: async (
    userId: string,
    profileData: UpdateUserProfileData,
  ) => {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, role: "customer" },
      {
        $set: {
          ...(profileData.fullName !== undefined && {
            fullName: profileData.fullName,
          }),
          ...(profileData.mobile !== undefined && {
            mobile: profileData.mobile,
          }),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return {
        success: false,
        message: "Profile details not found.",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    };
  },

  changeUserPassword: async (
    userId: string,
    passwordData: ChangeUserPasswordData,
  ) => {
    const { currentPassword, newPassword } = passwordData;

    const user = await User.findOne({
      _id: userId,
      role: "customer",
    }).select("+password");

    if (!user) {
      return {
        success: false,
        message: "User not found.",
        code: "NOT_FOUND",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect.",
        code: "INVALID_CURRENT_PASSWORD",
      };
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 8;

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;

    await user.save();

    return {
      success: true,
      message: "Password changed successfully.",
    };
  },

  getAllCustomers: async () => {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: "Customers fetched successfully.",
      data: customers,
    };
  },
};

module.exports = userService;
