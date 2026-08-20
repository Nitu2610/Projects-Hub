import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

// LogoutButton:
// Handles user logout and redirects to the login page.
// AuthContext manages the authentication state.
export const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authenticated user before redirecting to login.
    logout();
    navigate("/login");
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};
