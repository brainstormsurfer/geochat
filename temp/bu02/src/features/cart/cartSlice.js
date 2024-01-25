import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const defaultState = {
  cartHelpers: [],
  numHelpersInCart: 0,
  cartTotal: 0,
  mobility: 500,
  tax: 0,
  orderTotal: 0,
};
const getCartFromLocalStorage = () => {
  return JSON.parse(localstorage.getItem('cart')) || defaultState;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getCartFromLocalStorage(),
  reducers: {
    addHelper: (state, action) => {
      const { event } = action.payload;
      const helper = state.cartHelpers.find((i) => i.cartID === event.cartID);
      if (helper) {
        helper.amount += event.amount;
      } else {
        state.cartHelpers.push(event);
      }

      state.numHelpersInCart += event.amount;
      state.cartTotal += event.eventDate * event.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.success('Helper added to cart');
    },
    clearCart: (state) => {
      localstorage.setItem('cart', JSON.stringify(defaultState));
      return defaultState;
    },
    removeHelper: (state, action) => {
      const { cartID } = action.payload;
      const event = state.cartHelpers.find((i) => i.cartID === cartID);
      state.cartHelpers = state.cartHelpers.filter((i) => i.cartID !== cartID);
      state.numHelpersInCart -= event.amount;
      state.cartTotal -= event.eventDate * event.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.error('Helper removed from cart');
    },
    editHelper: (state, action) => {
      const { cartID, amount } = action.payload;
      const helper = state.cartHelpers.find((i) => i.cartID === cartID);
      state.numHelpersInCart += amount - helper.amount;
      state.cartTotal += helper.eventDate * (amount - helper.amount);
      helper.amount = amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.success('Cart updated');
    },
    calculateTotals: (state) => {
      state.tax = 0.1 * state.cartTotal;
      state.orderTotal = state.cartTotal + state.mobility + state.tax;
      localstorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addHelper, clearCart, removeHelper, editHelper } = cartSlice.actions;

export default cartSlice.reducer;
