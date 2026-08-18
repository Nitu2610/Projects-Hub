const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect Mongoose to the MongoDB database specified in the connection URL.
    await mongoose.connect(process.env.MONGO_URL);

    // console.log("Database name:", mongoose.connection.name);
    console.log("✅ MongoDB Connected.");
  } catch (error) {
    console.log("❌ MongoDB connection Failed");
    console.log(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
