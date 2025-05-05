import React, { memo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useProvideHooks from "../hooks/useProvideHooks";
import useReduxHooks from "../hooks/useReduxHooks";

const UserProtectedRoute = () => {
  const { navigate } = useProvideHooks();
  const { auth } = useReduxHooks();

  const UserAuthorized = auth?.status || false;

  useEffect(() => {
    if (!UserAuthorized) navigate("/signin");
    return;
  }, []);

  return UserAuthorized && <Outlet />;
};

export default memo(UserProtectedRoute);
