import { createSlice } from "@reduxjs/toolkit";

const quantitySlice = createSlice({
  name: "quantities",
  initialState: {},
  reducers: {
    setInitialQuantities(state, action) {
      return action.payload; // { productId: quantity, ... }
    },
    increaseQuantity(state, action) {
      const { productId, stock } = action.payload;
      if (!state[productId]) state[productId] = 1;
      if (state[productId] < stock) {
        state[productId] += 1;
      }
    },
    decreaseQuantity(state, action) {
      const { productId } = action.payload;
      if (!state[productId]) state[productId] = 1;
      if (state[productId] > 1) {
        state[productId] -= 1;
      }
    },
    changeQuantity(state, action) {
      const { productId, quantity, stock } = action.payload;
      const newQty = Math.min(Math.max(quantity, 1), stock);
      state[productId] = newQty;
    },
  },
});

export const {
  setInitialQuantities,
  increaseQuantity,
  decreaseQuantity,
  changeQuantity,
} = quantitySlice.actions;

export default quantitySlice.reducer;
