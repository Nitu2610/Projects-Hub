import { Navigate, Outlet } from "react-router-dom";
import { Heading } from "@chakra-ui/react";

import { useGetMeQuery } from "../redux/api/apiSlice";
import { LoadingComp } from "../components/LoadingComp";
import { ErrorComp } from "../components/ErrorComp";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isLoading, isError, error, data } = useGetMeQuery();

  if (isLoading) {
    return <LoadingComp />;
  }

  if (
    isError &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "status" in error.data &&
    error.data.status === 401
  ) {
    return (
      <ErrorComp
        status={401}
        message={
          "message" in error.data && typeof error.data.message === "string"
            ? error.data.message
            : "Authentication failed."
        }
      />
    );
  }

if (allowedRoles && data?.data?.role && allowedRoles.includes(data.data.role)) {
    return <Outlet />;
  }

  return <Navigate to="/unauthorized" replace />;
};