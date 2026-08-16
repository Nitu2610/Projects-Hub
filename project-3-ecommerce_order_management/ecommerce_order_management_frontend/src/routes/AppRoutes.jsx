
import { Route, Routes } from "react-router-dom"
import { Home } from "../pages/Home"
import { MainLayout } from "../layouts/MainLayout"


export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout/>} >
        <Route index element={<Home/>} />
      </Route>
    </Routes>
  )
}
