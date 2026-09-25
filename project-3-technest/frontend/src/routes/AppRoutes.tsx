import { Route, Routes } from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout";

import { Unauthorized } from "../pages/Unauthorized";

import Products from "../features/products/pages/Products";
import { ProductDetails } from "../features/products/pages/ProductDetails";

import { Orders } from "../features/orders/pages/Orders";

import { AdminOrders } from "../features/orders/pages/admin/AdminOrder";
import { AdminOrderDetails } from "../features/orders/pages/admin/AdminOrderDetails";

import { AdminProducts } from "../features/products/pages/admin/AdminProducts";
import { AddProduct } from "../features/products/pages/admin/AddProduct";
import { EditProduct } from "../features/products/pages/admin/EditProduct";

import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { Register } from "../features/auth/pages/Register";
import { Login } from "../features/auth/pages/Login";
import { Addresses } from "../features/address/components/Addresses";

import { AdminCustomers } from "../features/customers/pages/AdminCustomers";

import { AdminCategories } from "../features/categories/pages/AdminCategories";
import { AdminReviews } from "../features/reviews/pages/AdminReviews";
import { Cart } from "../features/cart/pages/Cart";
import { OrderDetails } from "../features/orders/pages/OrderDetails";
import { AdminLayout } from "../layouts/admin/AdminLayout";
import { AdminDashboard } from "../features/admin-dashboard/pages/AdminDashboard";
import { Checkout } from "../features/checkout/pages/Checkout";
import { Payment } from "../features/payments/pages/Payment";
import { Home } from "../features/customers/pages/Home";
import { Profile } from "../features/customers/pages/Profile";

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
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/admin/products" element={<AdminProducts />} />

              <Route path="/admin/categories" element={<AdminCategories />} />

              <Route path="/admin/customers" element={<AdminCustomers />} />

              <Route path="/admin/reviews" element={<AdminReviews />} />

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
      </Route>
    </Routes>
  );
};
