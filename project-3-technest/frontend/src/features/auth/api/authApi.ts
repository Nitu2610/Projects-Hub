import { apiSlice } from "../../../redux/api/apiSlice";





interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userData: {
      role: string;
      name: string;
      userId: string;
    };
  };
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    fullName: string;
    email: string;
    mobile: string;
    role: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    userRegister: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
    }),

    userLogin: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    userLogout: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useUserRegisterMutation,
  useUserLoginMutation,
  useUserLogoutMutation,
} = authApi;
