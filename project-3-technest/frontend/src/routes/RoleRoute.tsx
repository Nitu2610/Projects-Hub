import { Navigate, Outlet } from "react-router-dom";
import { useGetUserProfileQuery } from "../redux/api/authApi";

interface RoleRouteProps {
  allowedRoles: string[];
}

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { data } = useGetUserProfileQuery();

  const userRole = data?.data?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
