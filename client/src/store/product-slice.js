import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    productsData: [],
    productData: {},
    popularProductsData: [],
  },
  reducers: {
    setProducts(state, action) {
      state.productsData = action.payload;
    },
    removeProducts(state, action) {
      const updatedProducts = state.productsData.filter(
        (product) => product._id !== action.payload
      );
      state.productsData = updatedProducts;
    },
    emptyProducts(state, action) {
      state.productsData = [];
    },
    sortByPriceLowToHigh(state, action) {
      state.productsData = state.productsData.sort((a, b) => a.price - b.price);
    },
    sortByPriceHighToLow(state, action) {
      state.productsData = state.productsData.sort((a, b) => b.price - a.price);
    },
    sortByNameAtoZ(state, action) {
      state.productsData = state.productsData.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
    sortByNameZtoA(state, action) {
      state.productsData = state.productsData.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    },
    setPopularProducts(state, action) {
      state.popularProductsData = action.payload;
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice;
