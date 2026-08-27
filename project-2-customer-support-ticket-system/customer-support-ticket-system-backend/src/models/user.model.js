const mongoose = require("mongoose");

// User model represents all authenticated users in the system.
// The roles field determines whether the account belings to a 
// customer, agent, or administrator.
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    // Password hashes are excluded from normal queries.
    // Login explicitly selects this fields when bcrypt needs
    // to compare the supplied passowrd with the stored hash.
    password: {
      type: String,
      required: true,
      select:false,
    },

    // A single User model supports the three application roles.
    role: {
      type: String,
      enum: ["customer", "agent", "admin"],
      default: "customer",
    },

    // Allows an accounts to be disable without deleting its history
    // from the database.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
