const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const categoryRoute = require("./routes/category.route");
const errorHandler = require("./middlewares/errorHandler");
const productRoute = require("./routes/product.route");
const cartRoute = require("./routes/cart.route");
const addressRoute = require("./routes/address.route");
const orderRoute = require("./routes/order.route");
const adminOrderRoute = require("./routes/admin.order.route");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(morgan("dev"));

app.use(cookieParser());

app.use("/users", userRoute);


app.use("/category", categoryRoute);

app.use("/products", productRoute);

app.use("/cart", cartRoute);

app.use("/addresses", addressRoute);

app.use("/orders", orderRoute);

app.use("/admin/orders", adminOrderRoute);

app.use(errorHandler);

module.exports = app;
