import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productsArray: [],
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.productsArray = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});


export const{setProducts,setLoading,setError}=productSlice.actions;

export default productSlice.reducer;