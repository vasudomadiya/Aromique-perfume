import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload || [];
        },
        addToCart: (state, action) => {
            const item = action.payload;
            const itemId = item._id || item.id;
            const existItem = state.cartItems.find((x) => (x._id || x.id) === itemId);
            if (existItem) {
                existItem.qty = (existItem.qty || 1) + (item.qty || 1);
            } else {
                state.cartItems.push({ ...item, qty: item.qty || 1 });
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        updateQuantity: (state, action) => {
            const item = state.cartItems.find((x) => (x._id || x.id) === action.payload.id);
            if (item) item.qty = Math.max(1, action.payload.qty);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((x) => (x._id || x.id) !== itemId);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
    },
});

export const { setCartItems, addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;