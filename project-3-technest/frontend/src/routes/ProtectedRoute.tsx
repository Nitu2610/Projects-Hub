
import { Navigate, Outlet } from "react-router-dom";
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

  // Authentication failed
  if (
    isError &&
    "status" in error &&
    error.status === 401
  ) {
    return <Navigate to="/login" replace />;
  }

  // Other API/server/network errors
  if (isError) {
    return (
      <ErrorComp
        status={500}
        message="Unable to verify your session. Please try again."
      />
    );
  }

  // User is authenticated but does not have permission
  if (
    allowedRoles &&
    data?.data?.role &&
    !allowedRoles.includes(data.data.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

