import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartApi, getMyCartApi } from "../../services/api";

export const fetchMyCart = createAsyncThunk(
  "cart/fetchMyCart",
  async (_, thunkAPI) => {
    try {
      const res = await getMyCartApi();
      if (res.success) return res.data;
      return thunkAPI.rejectWithValue(res.message || "Failed to fetch cart");
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      const res = await addToCartApi(productId, quantity);
      if (res.success) return res.data;
      return thunkAPI.rejectWithValue(res.message || "Failed to add to cart");
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

const initialState = {
  items: [],
  totalCartPrice: 0,
  totalCartQuantity: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.totalCartPrice = 0;
      state.totalCartQuantity = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyCart
      .addCase(fetchMyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalCartPrice = action.payload.totalCartPrice || 0;
        state.totalCartQuantity = action.payload.totalCartQuantity || 0;
      })
      .addCase(fetchMyCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalCartPrice = action.payload.totalCartPrice || 0;
        state.totalCartQuantity = action.payload.totalCartQuantity || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
