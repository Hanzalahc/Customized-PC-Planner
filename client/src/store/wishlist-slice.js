import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
  },
  reducers: {
    addTowishlist(state, action) {
 
      const existingItem = state.wishlist.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        toast.error("Item already in wishlist");
        return;
      } else {
        state.wishlist.push({
          ...action.payload,
        });
        toast.success("Item added to wishlist");
      }
    },
    removeFromwishlist(state, action) {
      const existingItem = state.wishlist.find(
        (item) => item._id === action.payload
      );

      if (existingItem) {
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.payload
        );
        toast.success("Item removed from wishlist");
      }
    },

    clearwishlist(state) {
      if (state.wishlist.length === 0) {
        toast.error("wishlist is already empty");
        return;
      }
      state.wishlist = [];
      toast.success("wishlist cleared");
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice;
