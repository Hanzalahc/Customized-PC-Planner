import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import sidebarSlice from "./sidebar-slice";
import adminSlice from "./admin-slice";
import productSlice from "./product-slice";
import cartSlice from "./cart-slice";
import wishlistSlice from "./wishlist-slice";
import adminStatsSlice from "./adminStats-slice";
import protectedSlice from "./protected-slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "admin",
    "product",
    "protected",
    "cart",
    "wishlist",
  ],
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  sidebar: sidebarSlice.reducer,
  admin: adminSlice.reducer,
  product: productSlice.reducer,
  protected: protectedSlice.reducer,
  cart: cartSlice.reducer,
  wishlist: wishlistSlice.reducer,
  adminStats: adminStatsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
