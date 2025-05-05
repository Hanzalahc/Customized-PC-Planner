import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isAuth: false,
    userId: "",
    role: "admin",
    name: "",
    email: "",
    avatar: "",
    refreshToken: "",
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = true;
      state.userId = action.payload._id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar.url;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.isAuth = false;
      state.userId = "";
      state.email = "";
      state.name = "";
      state.avatar = "";
      state.refreshToken = "";
    },
  },
});

export const adminActions = adminSlice.actions;
export default adminSlice;
