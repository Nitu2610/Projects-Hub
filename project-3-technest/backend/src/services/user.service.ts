import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthPayload } from "../types/auth.types";
const User = require("../models/user.model");

interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

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

    const jwtScretKey = process.env.JWT_SECRET_KEY;

    if (!jwtScretKey) {
      throw new Error("JWT_SECREWT_KEY is missing.");
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, jwtScretKey, {
      expiresIn: "1d",
    });

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
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return {
        success: false,
        message: "Profile details not found.",
        code: "NOT_FOUND",
      };
    }

    const { password, ...safeData } = user.toObject();
console.log(safeData)
    return {
      success: true,
      message: "Successfully found the profile details.",
      data: safeData,
    };
  },

  updateUserProfile: async (
    userId: string,
    profileData: {
      fullName?: string;
      mobile?: string;
    },
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
    currentPassword: string,
    newPassword: string,
  ) => {
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

    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );

    user.password = hashedPassword;

    await user.save();

    return {
      success: true,
      message: "Password changed successfully.",
    };
  },
};

module.exports = userService;
