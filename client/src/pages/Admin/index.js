import { lazy } from "react";

// Lazily loaded admin pages
const AdminHome = lazy(() => import("./Home/AdminHome.jsx"));
const AdminLogin = lazy(() => import("./Auth/AdminLogin.jsx"));
const AdminProductListing = lazy(() =>
  import("./Product/AdminProductListing.jsx")
);
const AdminProductAdd = lazy(() => import("./Product/AdminProductAdd.jsx"));
const AdminCategoryList = lazy(() =>
  import("./Category/AdminCategoryList.jsx")
);
const AdminCategoryAdd = lazy(() => import("./Category/AdminCategoryAdd.jsx"));
const AdminSubCategoryList = lazy(() =>
  import("./Category/AdminSubCategoryList.jsx")
);
const AdminSubCategoryAdd = lazy(() =>
  import("./Category/AdminSubCategoryAdd.jsx")
);
const AdminUsersList = lazy(() => import("./Users/AdminUsersList.jsx"));
const AdminOrdersList = lazy(() => import("./Orders/AdminOrdersList.jsx"));
const AdminProductEditPage = lazy(() =>
  import("./Product/AdminProductEditPage.jsx")
);

export {
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
};
