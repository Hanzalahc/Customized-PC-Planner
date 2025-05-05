import React, { memo } from "react";
import {
  AdminUserTable,
} from "../../../components/Admin";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminUsersList = () => {
  const { sidebar } = useReduxHooks();
  const isSidebarOpen = sidebar.isSidebarOpen;
  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      <AdminUserTable />
    </div>
  );
};

export default memo(AdminUsersList);
