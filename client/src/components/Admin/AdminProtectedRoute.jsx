import React, { memo } from "react";
import useReduxHooks from "./../../hooks/useReduxHooks";
import useProvideHooks from "./../../hooks/useProvideHooks";
import { Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { navigate, useEffect } = useProvideHooks();
  const { admin } = useReduxHooks();

  const adminUserAuthorized = admin?.isAuth;

  useEffect(() => {
    if (!adminUserAuthorized) navigate("/admin/login");
    return;
  }, []);

  return adminUserAuthorized && <Outlet />;
};

export default memo(AdminProtectedRoute);
