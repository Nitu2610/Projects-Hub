import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../api/axios";

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userDetails, { rejectWithValue }) => {
    try {
      const checkUser = await api.get(`/users?email=${userDetails.email}`);

      if (checkUser.data.length > 0) {
        return rejectWithValue("Email address already used!!!!");
      }
      const res = await api.post("/users", userDetails);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser=createAsyncThunk(
    "auth/login",
    async(userCred,{rejectWithValue})=>{
        try {
            let checkCred= await api.get(`/users?email=${userCred.email}&password=${userCred.password}`);
            if(checkCred.data.length===0){
               return rejectWithValue("Invalid email or password")
            } else {
                return checkCred.data[0];
            }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)