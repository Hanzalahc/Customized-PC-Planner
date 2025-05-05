import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/index.js";
import Layout from "./Layout.jsx";
import AdminLayout from "./AdminLayout.jsx";

// Import pages
import {
  Home,
  About,
  Benchmarks,
  Cart,
  Case,
  Checkout,
  Components,
  Compatibility,
  Contact,
  Cpu,
  CpuBenchmarks,
  CpuCooler,
  CustomBuild,
  Gpu,
  GpuBenchmarks,
  MotherBoard,
  PreBuild,
  Psu,
  Ram,
  Signin,
  Signup,
  ForgotPassword,
  ChangePassword,
  Storage,
  Pagenotfound,
  MyWishlistPage,
  MyAccount,
  MyOrdersPage,
  MyAddressPage,
  OrderFailed,
  OrderSuccess,
  SearchResults,
  VerifyEmailLink,
  VerifyPassLink,
  ProductDetails,
  ChatBotPage,
} from "./pages/index";

// Import components
import { Loader, UserProtectedRoute } from "./components/index.js";

// Import admin  pages
import {
  AdminHome,
  AdminLogin,
  AdminProductListing,
  AdminProductAdd,
  AdminCategoryList,
  AdminCategoryAdd,
  AdminSubCategoryList,
  AdminSubCategoryAdd,
  AdminUsersList,
  AdminOrdersList,
  AdminProductEditPage,
} from "./pages/Admin";

// Import admin components
import { AdminProtectedRoute } from "./components/Admin";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/benchmarks", element: <Benchmarks /> },
        { path: "/cpu-benchmarks", element: <CpuBenchmarks /> },
        { path: "/cart", element: <Cart /> },
        { path: "/case", element: <Case /> },
        { path: "/components", element: <Components /> },
        { path: "/compatibility", element: <Compatibility /> },
        { path: "/contact", element: <Contact /> },
        { path: "/cpu", element: <Cpu /> },
        { path: "/cpu-cooler", element: <CpuCooler /> },
        { path: "/custom-build", element: <CustomBuild /> },
        { path: "/gpu", element: <Gpu /> },
        { path: "/gpu-benchmarks", element: <GpuBenchmarks /> },
        { path: "/motherboard", element: <MotherBoard /> },
        { path: "/pre-build", element: <PreBuild /> },
        { path: "/psu", element: <Psu /> },
        { path: "/ram", element: <Ram /> },
        { path: "/reset-password", element: <ChangePassword /> },
        { path: "/signin", element: <Signin /> },
        { path: "/signup", element: <Signup /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/verify-email-link/:token", element: <VerifyEmailLink /> },
        { path: "/verify-password-link/:token", element: <VerifyPassLink /> },
        { path: "/product/:productId", element: <ProductDetails /> },
        { path: "/storage", element: <Storage /> },
        { path: "/my-wishlist", element: <MyWishlistPage /> },
        {
          path: "/search-results",
          element: <SearchResults />,
        },
        {
          path: "/chatbot",
          element: <ChatBotPage />,
        },
        {
          element: <UserProtectedRoute />,
          children: [
            { path: "/checkout", element: <Checkout /> },
            { path: "/my-profile", element: <MyAccount /> },
            { path: "/my-orders", element: <MyOrdersPage /> },
            {
              path: "/my-address",
              element: <MyAddressPage />,
            },
            {
              path: "/order-success",
              element: <OrderSuccess />,
            },
            {
              path: "/order-failed",
              element: <OrderFailed />,
            },
          ],
        },
        { path: "*", element: <Pagenotfound /> },
      ],
    },

    // admin routes
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "login", element: <AdminLogin /> },

        {
          element: <AdminProtectedRoute />,
          children: [
            { path: "", element: <AdminHome /> },
            { path: "product-listing", element: <AdminProductListing /> },
            { path: "product-add", element: <AdminProductAdd /> },
            { path: "category-list", element: <AdminCategoryList /> },
            { path: "category-add", element: <AdminCategoryAdd /> },
            { path: "sub-category-list", element: <AdminSubCategoryList /> },
            { path: "sub-category-add", element: <AdminSubCategoryAdd /> },
            { path: "users-list", element: <AdminUsersList /> },
            { path: "orders-list", element: <AdminOrdersList /> },
            {
              path: "product-edit/:productId/:productType",
              element: <AdminProductEditPage />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster />
      </PersistGate>
    </Provider>
  );
}

export default App;
