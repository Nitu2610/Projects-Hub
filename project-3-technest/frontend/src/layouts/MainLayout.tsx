import { Outlet } from "react-router-dom";
import { Footer } from "./user/Footer";
import { Navbar } from "./user/Navbar";

export const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);
