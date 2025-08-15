import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategoryById = createAsyncThunk(
  "category/fetchById",
  async (id, thunkAPI) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/${id}`);
    if (!res.ok) throw new Error("Ошибка загрузки категории");
    return await res.json();
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
