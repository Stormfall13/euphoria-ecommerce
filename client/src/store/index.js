import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import productsReducer from "./slices/productsSlice";
import favoriteReducer from "./slices/favoriteSlice";
import cartReducer from "./slices/cartSlice";
import quantityReducer from "./slices/quantitySlice";
import commentsReducer from "./slices/commentsSlice";
import qnaReducer from './slices/qnaSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        products: productsReducer,
        favorites: favoriteReducer,
        cart: cartReducer,
        quantities: quantityReducer,
        comments: commentsReducer,
        qna: qnaReducer,
    },
});

export default store;
