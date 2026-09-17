import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  selectedAddressId: string | null;
}

const initialState: CheckoutState = {
  selectedAddressId: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setSelectedAddressId: (
      state,
      action: PayloadAction<string>
    ) => {
      state.selectedAddressId = action.payload;
    },

    clearCheckout: (state) => {
      state.selectedAddressId = null;
    },
  },
});

export const {
  setSelectedAddressId,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;