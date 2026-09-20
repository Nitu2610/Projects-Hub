import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { MainLayout } from "../layouts/MainLayout";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { Register } from "../pages/Register";
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
import { EditProduct } from "../pages/product/admin/EditProducts";
import { AddProduct } from "../pages/product/admin/AddProduct";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["customer", "admin"]} />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />

          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route
            path="/admin/orders/:orderId"
            element={<AdminOrderDetails />}
          />
          <Route path="/admin/add-product" element={<AddProduct />} />

          <Route
            path="/admin/products/:productId/edit"
            element={<EditProduct />}
          />
        </Route>
      </Route>

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* {  <Route path="*" element={<Unauthorized />} />} */}
    </Routes>
  );
};
