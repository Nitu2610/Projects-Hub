import { createContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store the logged-in user and authentication status.
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Check local storage and when the app starts.
  // This keeps the user logged in after refreshing the page.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!storedUser || !storedToken) {
      setUser(false);
      setIsAuthenticated(false);
    } else {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Save the login details and update the authentication state.
  const login = async (creds) => {
    const backendRes = await authApi.login(creds); // return data.
    const { token, user } = backendRes.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
