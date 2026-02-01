import { createSlice } from "@reduxjs/toolkit";

const initialCart = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
}; // Here I cant change the variable name.

const totalProductQuantity=(state)=>{
  return state.items.reduce((acc,cur)=> {return acc+(cur.productQuantity || 0)},0 )
}
const totalProductPrice=(state)=>{
  return state.items.reduce((acc,cur)=>  acc+ ( (cur.productQuantity || 0) * (cur.price || 0) ),0 )
}

export const cartSlice = createSlice({
  name: "cartProducts",
  initialState: initialCart, // the initialState shoule be the default name
  reducers: {
    addToCart: (state, action) => {
      let {id, title, price}= action.payload;
      const existingItem=state.items.find(item => item.id === id);

      if(existingItem){
        existingItem.productQuantity = (existingItem.productQuantity ||0 )+1;
      } else {
        let obj={
          id, title, price, productQuantity:1
        }
        state.items.push(obj)
      }

      state.totalQuantity= totalProductQuantity(state);
      state.totalPrice= totalProductPrice(state);
    },
    removeFromCart: (state, action) => {
     let {id}= action.payload;
      const existingItem=state.items.find(item => item.id === id);

      if(existingItem && existingItem?.productQuantity >1){
        existingItem.productQuantity -=1;
      } else {
        state.items= state.items.filter(item => item.id !== id);

        {/** Alternative approach to filter 
          const idx= state.items.findIndex(item => item.id === id);
          if( idx !== -1) state.items = state.items.splice(idx,1)
          */}
      }
       state.totalQuantity= totalProductQuantity(state);
      state.totalPrice= totalProductPrice(state);
    
    },
    clearCart: state=> initialCart,
  },
});


export const {addToCart, removeFromCart,clearCart } = cartSlice.actions;







