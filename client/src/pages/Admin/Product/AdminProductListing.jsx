import React, { memo, useState, useEffect } from "react";

import { AdminProductTable } from "../../../components/Admin";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminProductListing = () => {
  const { sidebar } = useReduxHooks();

  const isSidebarOpen = sidebar.isSidebarOpen;

  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%]"
      }`}
    >
      <AdminProductTable />
    </div>
  );
};

export default memo(AdminProductListing);
