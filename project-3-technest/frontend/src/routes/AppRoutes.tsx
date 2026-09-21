import { Route, Routes } from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout";

import { Home } from "../pages/Home";

import { Unauthorized } from "../pages/Unauthorized";

import Products from "../pages/product/Products";
import { ProductDetails } from "../pages/product/ProductDetails";

import { Cart } from "../pages/cart/Cart";

import { Checkout } from "../pages/Checkout";
import { Payment } from "../pages/Payment";

import { Orders } from "../pages/order/Orders";
import { OrderDetails } from "../pages/order/OrderDetails";

import { AdminOrders } from "../pages/order/admin.order/AdminOrder";
import { AdminOrderDetails } from "../pages/order/admin.order/AdminOrderDetails";

import { AdminProducts } from "../pages/product/admin/AdminProducts";
import { AddProduct } from "../pages/product/admin/AddProduct";
import { EditProduct } from "../pages/product/admin/EditProducts";

import { Profile } from "../pages/Profile";

import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { Addresses } from "../components/address/Addresses";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/userRegister" element={<Register />} />
      <Route path="/userLogin" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />

          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<Addresses />} />

          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/products" element={<AdminProducts />} />

            <Route
              path="/admin/products/:productId/edit"
              element={<EditProduct />}
            />

            <Route path="/admin/add-product" element={<AddProduct />} />

            <Route path="/admin/orders" element={<AdminOrders />} />

            <Route
              path="/admin/orders/:orderId"
              element={<AdminOrderDetails />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
