import { Navigate, Outlet } from "react-router-dom";
import { useGetUserProfileQuery } from "../features/customers/api/customerApi";


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
