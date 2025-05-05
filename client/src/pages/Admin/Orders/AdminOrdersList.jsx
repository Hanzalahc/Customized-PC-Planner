import React, { memo } from "react";
import useReduxHooks from "../../../hooks/useReduxHooks";
import { AdminHomeRecentOrders } from "../../../components/Admin";

const AdminOrdersList = () => {
  const { sidebar } = useReduxHooks();
  const isSidebarOpen = sidebar.isSidebarOpen;
  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      {/* recent order  */}

      <AdminHomeRecentOrders />
    </div>
  );
};

export default memo(AdminOrdersList);
