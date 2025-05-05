import { createSlice } from "@reduxjs/toolkit";

// when order, product or user is deleted or updated we need to update the admin stats usestate data on admin hom page component so we will use redux to update the data once the refactor is done
const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState: {
    ordersDataChange: false,
    productsDataChange: false,
    usersData: false,
    data: [],
  },
  reducers: {
    updateOrdersDataChange(state, action) {
      state.ordersDataChange = action.payload;
    },
    updateProductsDataChange(state, action) {
      state.productsDataChange = action.payload;
    },
    updateUsersDataChange(state, action) {
      state.usersData = action.payload;
    },
    updateData(state, action) {
      state.data = action.payload;
    },
  },
});

export const adminStatsActions = adminStatsSlice.actions;
export default adminStatsSlice;
