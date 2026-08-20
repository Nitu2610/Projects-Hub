import { axiosInstance } from "./axiosInstance";

// API layer for user-related requested.
// Handles HTTP communication with user endpoints.
export const userApi = {
  // Retrieve users avaliable to the authenticated adminstrator.
  getUsers: async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },
};
