import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "./actions/authActions";


export const getUserFromLocalStorage=()=>{
    const userDetails=(JSON.parse(localStorage.getItem("user")));
    return userDetails;
}

export const setUserToLocalStorage=(userData)=>{
    return localStorage.setItem("user",(JSON.stringify(userData)))
}

const authUserInitialState={
    user:getUserFromLocalStorage() || null,
    loading:false,
    error:null
};

export const authSlice=createSlice({
    name:"authUser",
    initialState:authUserInitialState,
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.loading=false;
            
            state.error=null;
            localStorage.removeItem("user");
        }
    },
    extraReducers:(builder)=>
        builder
                .addCase(signupUser.pending,(state)=>{
                    state.loading=true;
                })
                .addCase(signupUser.fulfilled,(state,action)=>{
                    state.loading=false;
                    state.user=action.payload;
                     setUserToLocalStorage(action.payload)
                })
                .addCase(signupUser.rejected,(state,action)=>{
                    state.loading=false;
                    state.error=action.payload;
                })
                .addCase(loginUser.pending,(state)=>{
                    state.loading=true;
                })
                .addCase(loginUser.fulfilled,(state,action)=>{
                    state.loading=false;
                    state.user=action.payload;
                    setUserToLocalStorage(action.payload);

                })
                .addCase(loginUser.rejected,(state,action)=>{
                    state.loading=false;
                    state.error=action.payload;
                })

}) 

export const {logout} = authSlice.actions;