import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронные действия
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/product/${productId}`);
      if (!response.ok) throw new Error('Ошибка загрузки комментариев');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ productId, text, guestName, guestEmail, rating }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const user = getState().auth.user;
      
      const payload = {
        productId,
        text,
        rating,
        ...(!token && { guestName, guestEmail }),
        ...(token && user && { userId: user.id })
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при отправке комментария');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addComment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Комментарий отправлен на модерацию!';
        state.items.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = commentsSlice.actions;
export default commentsSlice.reducer;