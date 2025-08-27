import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронные действия
export const fetchQnA = createAsyncThunk(
  'qna/fetchQnA',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna/product/${productId}`);
      if (!response.ok) throw new Error('Ошибка загрузки вопросов и ответов');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addQnAItem = createAsyncThunk(
  'qna/addQnAItem',
  async ({ productId, text, parentId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          text,
          parentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при отправке');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQnAItem = createAsyncThunk(
  'qna/deleteQnAItem',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/qna/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при удалении');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const qnaSlice = createSlice({
  name: 'qna',
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
    setAnswerText: (state, action) => {
      const { questionId, text } = action.payload;
      state.answerTexts = state.answerTexts || {};
      state.answerTexts[questionId] = text;
    },
    setOpenAnswerFor: (state, action) => {
      state.openAnswerFor = action.payload;
    },
    setQuestionText: (state, action) => {
      state.questionText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchQnA
      .addCase(fetchQnA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQnA.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQnA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addQnAItem
      .addCase(addQnAItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addQnAItem.fulfilled, (state, action) => {
        state.loading = false;
        const newItem = action.payload;
        
        if (newItem.parentId) {
          // Это ответ - добавляем к вопросу
          state.items = state.items.map(item =>
            item.id === newItem.parentId
              ? { ...item, answers: [...(item.answers || []), newItem] }
              : item
          );
          state.success = 'Ответ добавлен!';
        } else {
          // Это вопрос - добавляем в начало
          state.items = [{ ...newItem, answers: [] }, ...state.items];
          state.success = 'Вопрос задан!';
          state.questionText = '';
        }
      })
      .addCase(addQnAItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteQnAItem
      .addCase(deleteQnAItem.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter(item => 
          item.id !== deletedId && item.parentId !== deletedId
        );
        state.success = 'Удалено успешно';
      })
      .addCase(deleteQnAItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  setAnswerText, 
  setOpenAnswerFor, 
  setQuestionText 
} = qnaSlice.actions;

export default qnaSlice.reducer;