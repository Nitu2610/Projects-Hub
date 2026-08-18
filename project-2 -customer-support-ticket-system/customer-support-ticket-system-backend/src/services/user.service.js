const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Service responsibility:
// Handle user-related business logic and database operations.
// Controllers should not direclty interact with the User model.
const getAllUsers = async () => {
  const users = await User.find().select(
    "firstName lastName email role isActive createdAt"
  )

  return {
    success: true,
    data: users,
  };
};

// Create a user with the role supplied by the calling controller.
//
// The service is responsible for:
// 1. Checking whether the email is already registered
// 2. Selecting the fields that can be stored
// 3. Hashing the password
// 4. Creating the database record
const createUser = async (userData, role) => {
  const existingUser = await User.findOne({
    email: userData.email,
  });

  if (existingUser) {
    return {
      success: false,
      code: "EMAIL_ALREADY_REGISTERED",
      message: "Email address is already registered.",
    };
  }

  // Allowlisting:
  // Only fields explicitly selected here are written to the database.
  // This prevents unexpected fields from req.body from being persisted.
  const { firstName, lastName, email, password } = userData;

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userDetails = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  };

  const user = await User.create(userDetails);

  return {
    success: true,
    message: " User created successfully.",
    data: user,
  };
};

// Authenticate a user using email and password.
// Returns a JWT after the credentials are successfully verified.
const userLogin = async (userData) => {
  const { email, password: clientPassword } = userData;

  // Password is excluded from normal User queries by the schema.
  // Explicitly select it here because bcrypt needs the stored hash
  // to verify the password supplied during login.
  const user = await User.findOne({ email }).select("+password");
  console.log(user)
  if (!user) {
    return {
      success: false,
      code: "EMAIL_NOT_REGISTERED",
      message: "Email address is not registered.",
    };
  }

  const isPasswordMatch = await bcrypt.compare(clientPassword, user.password);

  if (!isPasswordMatch) {
    return {
      success: false,
      code: "INCORRECT_PASSWORD",
      message: "Incorrect password!",
    };
  }

  // The JWT contains only the information required to identify
  // and authorize the authenticated user on subsequent requests.
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  return {
    success: true,
    message: "User logged in successfully.",
    data: {
      user,
      token,
    },
  };
};

module.exports = {
  getAllUsers,
  createUser,
  userLogin,
};
