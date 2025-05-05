import { Button } from "@mui/material";
import { RiMenu2Line } from "react-icons/ri";
import { AdminHeaderRightSide } from "../";
import React, { memo, useCallback } from "react";
import useReduxHooks from "./../../../hooks/useReduxHooks";

const AdminHeader = () => {
  const { sidebar, sidebarActions, dispatch } = useReduxHooks();

  const handleSidebarToggle = useCallback(() => {
    dispatch(
      sidebarActions.setSidebar({ isSidebarOpen: !sidebar.isSidebarOpen })
    );
  }, [dispatch, sidebar.isSidebarOpen, sidebarActions]);

  return (
    <header
      className={`w-full h-auto py-2 pr-5 shadow-md bg-[#fff] transition-all  flex items-center justify-between ${
        sidebar.isSidebarOpen ? "pl-64" : "pl-5 "
      } `}
    >
      <div className="part1">
        <Button
          onClick={handleSidebarToggle}
          className="!w-10 !h-10 !rounded-full !min-w-10 !text-[rgba(0,0,0,0.8)] "
        >
          <RiMenu2Line className="text-xl text-[rgba(0,0,0,0.8)]" />
        </Button>
      </div>
      <AdminHeaderRightSide />
    </header>
  );
};

export default memo(AdminHeader);
