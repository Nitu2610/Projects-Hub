import { Navigate, Outlet } from "react-router-dom";
import { LoadingComp } from "../components/shared/LoadingComp";
import { ErrorComp } from "../components/shared/ErrorComp";
import { useGetUserProfileQuery } from "../features/customers/api/customerApi";


export const PrivateRoute = () => {
  const { isLoading, isError, error } = useGetUserProfileQuery();

  if (isLoading) {
    return <LoadingComp />;
  }

  if (isError && "status" in error && error.status === 401) {
    return <Navigate to="/userLogin" replace />;
  }

  if (isError) {
    return (
      <ErrorComp
        status={500}
        message="Unable to verify your session. Please try again."
      />
    );
  }

  return <Outlet />;
};
