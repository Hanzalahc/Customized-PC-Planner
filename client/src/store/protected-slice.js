import { createSlice } from "@reduxjs/toolkit";

const protectedSlice = createSlice({
  name: "protected",
  initialState: {
    emailVerifyPageAccess: false,
    resetPassPageAccess: false,
  },
  reducers: {
    setEmailVerifyPageAccess: (state, action) => {
      state.emailVerifyPageAccess = action.payload;
    },
    setResetPassPageAccess: (state, action) => {
      state.resetPassPageAccess = action.payload;
    },
  },
});

export const protectedActions = protectedSlice.actions;
export default protectedSlice;
