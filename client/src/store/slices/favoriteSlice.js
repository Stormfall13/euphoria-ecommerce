import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Ошибка загрузки избранного");
    const favorites = await res.json();
    return favorites.map(fav => fav.productId);
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    ids: [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleFavoriteLocally: (state, action) => {
      const id = action.payload;
      state.ids.includes(id)
        ? state.ids = state.ids.filter((favId) => favId !== id)
        : state.ids.push(id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { toggleFavoriteLocally } = favoriteSlice.actions;
export default favoriteSlice.reducer;
