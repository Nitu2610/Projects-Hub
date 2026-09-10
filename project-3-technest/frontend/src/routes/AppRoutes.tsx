
import { Route, Routes } from "react-router-dom"
import { Home } from "../pages/Home"
import { MainLayout } from "../layouts/MainLayout"
import { Login } from "../pages/Login"
import { ProtectedRoute } from "./ProtectedRoute"


export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
      <Route path="/" element={<MainLayout/>} >
        <Route index element={<Home/>} />
      </Route>
      </Route>


        <Route path="/login" element={<Login/>} />
    </Routes>
  )
}
