// Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer, ProgressBar, Loader } from "./components/index";
import useProvideHooks from "./hooks/useProvideHooks";
import useReduxHooks from "./hooks/useReduxHooks";
import useApiSubmit from "./hooks/useApiSubmit";

const Layout = () => {
  const location = useLocation();
  const { apis } = useProvideHooks();
  const { authActions, auth, dispatch } = useReduxHooks();
  const { apiSubmit, loading } = useApiSubmit();

  const currentUserRefreshToken = auth.userData?.refreshToken || false;

  // Pages where header, footer, and progress bar should be hidden
  const hideHeaderFooter = [
    "/signin",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/change-password",
    "/verify-email",
    "/set-google-pass",
    "/google-redirect",
    "/reset-password",
    "order-success",
    "/order-failed",
    "/chatbot",
  ];
  const shouldHideHeaderFooter = hideHeaderFooter.includes(location.pathname);

  const refreshAccressToken = async () => {
    const response = await apiSubmit({
      url: apis().refreshAccressToken.url,
      method: apis().refreshAccressToken.method,
      values: {
        refreshToken: currentUserRefreshToken,
      },
      successMessage: null,
      showLoadingToast: true,
    });

    if (!response?.success) {
      handleLogout();
      dispatch(authActions?.logout());
    }
  };

  const handleLogout = async () => {
    await apiSubmit({
      url: apis().userLogout.url,
      method: apis().userLogout.method,
      showLoadingToast: true,
      successMessage: null,
    });
  };

  // initial fetch
  useEffect(() => {
    if (currentUserRefreshToken) {
      refreshAccressToken();
    }
  }, []);

  if (loading && !auth?.status) {
    return <Loader />;
  }

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Outlet />
      {!shouldHideHeaderFooter && <Footer />}
      {!shouldHideHeaderFooter && <ProgressBar />}
    </>
  );
};

export default Layout;
