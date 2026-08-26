import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Heading } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";

// Protects private routes by allowing access only to authenticated users.

export const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // Wait for the authentication state to be resolved.
  if (isAuthenticated === null) return <Heading> Loading... </Heading>;

  // Render the requested page for authenticated user; otherwise redirect to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
