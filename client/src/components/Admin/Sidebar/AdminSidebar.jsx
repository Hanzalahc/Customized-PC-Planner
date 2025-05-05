import React, { memo } from "react";
import { Link } from "react-router-dom";
import { AdminSidebarUL } from "../";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminSidebar = () => {
  const { sidebar } = useReduxHooks();
  const isSidebarOpen = sidebar.isSidebarOpen;
  return (
    <aside>
      <div
        className={`${
          isSidebarOpen ? "w-[18%]" : "w-[0px] "
        } fixed top-0 left-0 bg-[#fff] h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-4`}
      >
        <div className="py-2 w-full">
          <Link to="/">
            <img
              src="https://ecme-react.themenate.net/img/logo/logo-light-full.png"
              alt=""
              className="w-32"
            />
          </Link>
        </div>
        <AdminSidebarUL />
      </div>
    </aside>
  );
};

export default memo(AdminSidebar);
