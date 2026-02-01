import { createSlice } from "@reduxjs/toolkit";

const initialCheckoutState={
   cartItems:[],
   deliveryAddress:null,
   paymentMethod:null
};

export const checkoutSlice=createSlice({
    name:'checkout',
    initialState:initialCheckoutState,
    reducers:{
        checkoutCartProducts : (state,action)=> {state.cartItems=action.payload},
         checkoutDeliveryAddress : (state,action)=> {state.deliveryAddress=action.payload},
          checkoutPaymentMethod : (state,action)=> {
            state.paymentMethod=action.payload;
           // console.log( state.paymentMethod)
          },
          resetCheckout: (state)=> {initialCheckoutState},
    }
})

export const {checkoutCartProducts, checkoutDeliveryAddress, checkoutPaymentMethod, resetCheckout}= checkoutSlice.actions;
