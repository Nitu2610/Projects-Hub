import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

// Handles authentication-related API requests.
export const authApi = {
  login: async (credentials) => {
    const url = `${baseUrl}/users/login`;

    const response = await axios.post(url, credentials);
    return response.data;
  },
};
