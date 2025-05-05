import React, { memo } from "react";
import {
  AdminHomeBoxes,
  AdminHomeRecentOrders,
  AdminProductTable,
  AdminAddProductButton,
  AdminHomeLineChart,
  AdminUserTable,
} from "../../../components/Admin";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminHome = () => {
  const { sidebar, admin } = useReduxHooks();

  const adminData = admin;

  const isSidebarOpen = sidebar.isSidebarOpen;

  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      <div className="w-full bg-whitebg py-5 px-5 border border-[rgba(0,0,0,0.1)] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info ">
          <h1 className="text-3xl font-semibold mb-3">
            Good Morning, <br /> {adminData?.name || "No Name"}{" "}
          </h1>
          <AdminAddProductButton />
        </div>
      </div>
      <AdminHomeBoxes />
      {/* line chart */}
      <div className="card my-4 bg-white tablet:rounded-lg shadow-md ">
        <div className="flex items-center justify-between px-5 py-5 pb-0">
          <h3 className="text-lg font-semibold">Total Users & Sales</h3>
        </div>
        <div className="flex items-center  gap-5 px-5 py-5 pt-1 ">
          <span className="flex items-center gap-1 text-base">
            <span className="block w-2 h-2 rounded-full bg-green-600"></span>
            Total Users
          </span>
          <span className="flex items-center gap-1 text-base">
            <span className="block w-2 h-2 rounded-full bg-blue-600"></span>
            Total Sales
          </span>
        </div>
        <AdminHomeLineChart />
      </div>
      {/* recent order  */}
      <AdminHomeRecentOrders />
      {/* products  */}

      <AdminProductTable />

      {/* users */}
      <AdminUserTable />
    </div>
  );
};

export default memo(AdminHome);
