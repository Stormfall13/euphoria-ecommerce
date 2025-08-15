import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (categoryId, thunkAPI) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products?categoryId=${categoryId}`);
    if (!res.ok) throw new Error("Ошибка загрузки товаров");
    return await res.json();
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
