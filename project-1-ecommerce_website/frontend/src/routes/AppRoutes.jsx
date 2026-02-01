import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { ProductList } from "../pages/ProductList";
import { ProductDetails } from "../pages/ProductDetails";
import { SignUp } from "../pages/SignUp";
import { LogIn } from "../pages/LogIn";
import { CartItems } from "../pages/CartItems";
import { PrivateRoute } from "./PrivateRoute";
import { Checkout } from "../pages/Checkout";
import { OrderSummary } from "../pages/OrderSummary";
import { DeliverDetails } from "../pages/DeliverDetails";
import { PaymentDetails } from "../pages/PaymentDetails";
import { CheckoutProductsSummary } from "../pages/CheckoutProductsSummary";

{
  /** The AppRoutes will display all the routing page, which means, all the comp will render here and content is dispay in this section. */
}

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/cart" element={<CartItems />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        > 
        {/** Using the "Routing Outlet" concept here. */}
          <Route index element={<CheckoutProductsSummary />} />
          <Route path="delivery_details" element={<DeliverDetails />} />
          <Route path="payment_details" element={<PaymentDetails />} />
          <Route path="overview" element={<OrderSummary />} />
        </Route>
      </Routes>
    </>
  );
};
