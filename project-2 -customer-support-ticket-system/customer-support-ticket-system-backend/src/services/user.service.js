const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  const users = await User.find();

  return users;
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

module.exports = { getAllUsers, createUser };
