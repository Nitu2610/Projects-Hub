import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { MainLayout } from "../layouts/MainLayout";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { Register } from "../pages/Register";
import { Unauthorized } from "../pages/Unauthorized";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />




         <Route path="*" element={<Unauthorized />} />
    </Routes>
  );
};
