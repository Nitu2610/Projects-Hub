import { axiosInstance } from "./axiosInstance";

// Handles authentication-related API requests.
export const authApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  },
};
