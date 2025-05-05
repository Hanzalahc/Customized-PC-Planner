import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: false,
    userData: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    setUserDetails: (state, action) => {
      state.userData.email = action.payload.email;
      state.userData.name = action.payload.name;
      state.userData.mobile = action.payload.mobile;
    },
    setUserAvatar: (state, action) => {
      state.userData.avatar.url = action.payload;
    },
    setUserAddress: (state, action) => {
      state.userData.addressDetails.push(action.payload);
    },
    removeUserAddress: (state, action) => {
      state.userData.addressDetails = state.userData.addressDetails.filter(
        (address) => address._id !== action.payload
      );
    },
    selectedAddress: (state, action) => {
      state.userData.selectedAddress = action.payload;
    },
    addOrderinOrderHistory: (state, action) => {
      state.userData.orderHistory = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
