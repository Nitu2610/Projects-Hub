import { configureStore } from "@reduxjs/toolkit";
import { productSlice } from "./productSlice";
import { cartSlice } from "./cartSlice";
import { authSlice } from "./authSlice";
import { checkoutSlice } from "./checkoutSlice";


export const store=configureStore({
    reducer: {
        products:productSlice.reducer,
        cart:cartSlice.reducer,
        auth:authSlice.reducer,
        checkout:checkoutSlice.reducer,
    },
})


/**
 * To access the product data of store we use "store.products" which is internally same as "store.reducer.products", here the "products" is the name of the slice which we set in the productSLice.js.
 */