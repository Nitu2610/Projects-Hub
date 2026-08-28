const app = require("./app");
require("dotenv").config();
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startSerrver = () => {
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server is running on the port ${PORT}`);
  });
};

startSerrver();
