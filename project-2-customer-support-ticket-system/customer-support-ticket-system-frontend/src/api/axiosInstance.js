import axios from "axios";

// Creates a shared Axios instance for all API requests.
// Centralizes the base URL and allows common configurations
// such as authentication headers and error handling to be added in one place.
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Intercept data before sending to server
// Add the JWT token to every outgoing request if the user is logged in.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Excluding the login url
  if (token && !config.url.includes("/users/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept the response recieved from the server.
// Handle API responses globally.
// If the backend returns 401 Unauthorized, the stored authentication
// data is cleared and the user is redirected to the login page.
axiosInstance.interceptors.response.use(
  (response)=> response,
  (error)=> {
    if(error.response?.status === 401){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      window.location.href= '/login';
    }

    return Promise.reject(error);
  }
)