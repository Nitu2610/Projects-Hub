const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async () => {
  const users = await User.find();
    return {
      success:true,
      data:users
    }
};

const createUser = async (userData) => {
  const checkEmail = await User.findOne({ email: userData.email });

  if (checkEmail) return null;

  const { firstName, lastName, email, password } = userData;

  const saltRound = Number(process.env.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRound);

  const userDetails = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
  };
  // allowlisting (or whitelisting)-  ensures only the fields backend expects are written to the database.

  const user = await User.create(userDetails);
  return user;
};

const userLogin = async (userData) => {
  const { email, password: clientPassword } = userData;

  const user = await User.findOne({ email });

  if (!user) {
    return {
      success: false,
      reason: "Email_Not_Registered",
    };
  }

  const isPasswordMatch = await bcrypt.compare(clientPassword, user.password);

  if (!isPasswordMatch) {
    return {
      success: false,
      reason: "Incorrect_Password",
    };
  }

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

  return { success:true, user, token };
};

module.exports = {
  getAllUsers,

  createUser,
  userLogin,
};
