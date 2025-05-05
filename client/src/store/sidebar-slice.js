import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isSidebarOpen: true,
  },
  reducers: {
    setSidebar: (state, action) => {
      state.isSidebarOpen = action.payload.isSidebarOpen;
    },
  },
});

export const sidebarActions = sidebarSlice.actions;
export default sidebarSlice;
