import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminHeader, AdminSidebar } from "./components/Admin";
import useReduxHooks from "./hooks/useReduxHooks";
import useProvideHooks from "./hooks/useProvideHooks";
import useApiSubmit from "./hooks/useApiSubmit";
import { Loader } from "./components";

const AdminLayout = () => {
  const { apis, navigate } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { sidebar, adminActions, admin, dispatch } = useReduxHooks();
  const location = useLocation();

  const isSidebarOpen = sidebar?.isSidebarOpen || false;
  const currentAdminRefreshToken = admin?.refreshToken || false;

  // Pages where header & sidebar should be hidden
  const hideHeaderFooter = ["/admin/login"];
  const shouldHideHeaderSidebar = hideHeaderFooter.includes(location.pathname);

  const refreshAccressToken = async () => {
    const response = await apiSubmit({
      url: apis().refreshAccressToken.url,
      method: apis().refreshAccressToken.method,
      values: {
        refreshToken: currentAdminRefreshToken,
      },
      successMessage: null,
      showLoadingToast: true,
    });

    if (!response?.success) {
      handleLogout();
      dispatch(adminActions.logout());
      navigate("/admin/login");
    }
  };

  const handleLogout = async () => {
    await apiSubmit({
      url: apis().userLogout.url,
      method: apis().userLogout.method,
      successMessage: null,
      showLoadingToast: true,
    });
  };

  // initial fetch
  useEffect(() => {
    if (currentAdminRefreshToken) {
      refreshAccressToken();
    }
  }, [currentAdminRefreshToken]);

  if (loading && !admin?.isAuth) {
    return <Loader />;
  }

  return (
    <>
      {!shouldHideHeaderSidebar && <AdminHeader />}
      {!shouldHideHeaderSidebar && (
        <div className="containMain flex">
          <div
            className={`sidebar-wrapper overflow-hidden ${
              isSidebarOpen ? "w-[18%]" : "w-[0px] opacity-0 transition-all"
            }`}
          >
            <AdminSidebar />
          </div>
          <Outlet />
        </div>
      )}

      {shouldHideHeaderSidebar && <Outlet />}
    </>
  );
};

export default AdminLayout;
