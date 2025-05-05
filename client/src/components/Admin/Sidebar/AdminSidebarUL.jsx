import { Button } from "@mui/material";
import React, { memo, useState } from "react";
import { Collapse } from "react-collapse";
import { FiUsers } from "react-icons/fi";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { RiProductHuntLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminSidebarUL = () => {
  const { apis, showSuccess, navigate } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, adminActions, admin } = useReduxHooks();
  const [isProductsCollapseOpen, setIsProductsCollapseOpen] = useState(false);
  const [isCategoryCollapseOpen, seIsCategoryCollapseOpen] = useState(false);

  const handleLogout = async () => {
    const logoutResponce = await apiSubmit({
      url: apis().userLogout.url,
      method: apis().userLogout.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Logging out..., Please wait!",
    });

    if (logoutResponce.success) {
      showSuccess("Logout successful");
      dispatch(adminActions.logout());
      navigate("/admin/login");
    }
  };

  return (
    <ul className="mt-4">
      <li>
        <Link to="/admin/">
          <Button className="w-full !capitalize !justify-start flex gap-3 text-xs !text-[rgba(0,0,0,0.8)] !font-semibold items-center !py-2 ">
            <RxDashboard className="text-base" />
            <span className="">Dashboard</span>
          </Button>
        </Link>
      </li>
      <li>
        <Link to="/admin/users-list">
          <Button className="w-full !capitalize !justify-start flex gap-3 text-xs !text-[rgba(0,0,0,0.8)] !font-semibold items-center !py-2 ">
            <FiUsers className="text-base" />
            <span className="">Users</span>
          </Button>
        </Link>
      </li>{" "}
      <li>
        <Button
          className="w-full !capitalize !justify-start flex gap-3 text-xs !text-[rgba(0,0,0,0.8)] !font-semibold items-center !py-2 "
          onClick={() => setIsProductsCollapseOpen(!isProductsCollapseOpen)}
        >
          <RiProductHuntLine className="text-base" />
          <span className="">Products</span>
          <span className="ml-auto  w-8 h-8 flex items-center justify-center">
            {isProductsCollapseOpen ? (
              <FaAngleUp className="transition-all" />
            ) : (
              <FaAngleDown className="transition-all" />
            )}
          </span>
        </Button>
        <Collapse isOpened={isProductsCollapseOpen}>
          <ul className="w-full">
            <Link to={"/admin/product-listing"}>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !pl-6 !text-sm !font-normal  !capitalize !w-full !justify-start flex gap-3">
                  <span className="block w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                  Product List
                </Button>
              </li>
            </Link>
            <Link to={"/admin/product-add"}>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !pl-6 !text-sm !font-normal  !capitalize !w-full !justify-start flex gap-3">
                  <span className="block w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                  Add Product
                </Button>
              </li>
            </Link>
          </ul>
        </Collapse>
      </li>
      {/* <li>
        <Button
          className="w-full !capitalize !justify-start flex gap-3 text-xs !text-[rgba(0,0,0,0.8)] !font-semibold items-center !py-2 "
          onClick={() => seIsCategoryCollapseOpen(!isCategoryCollapseOpen)}
        >
          <TbCategory className="text-base" />
          <span className="">Category</span>
          <span className="ml-auto  w-8 h-8 flex items-center justify-center">
            {isCategoryCollapseOpen ? (
              <FaAngleUp className="transition-all" />
            ) : (
              <FaAngleDown className="transition-all" />
            )}
          </span>
        </Button>
        <Collapse isOpened={isCategoryCollapseOpen}>
          <ul className="w-full">
            <Link to={"/admin/category-list"}>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !pl-6 !text-sm !font-normal  !capitalize !w-full !justify-start flex gap-3">
                  <span className="block w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                  Category List
                </Button>
              </li>
            </Link>
            <Link to={"/admin/category-add"}>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !pl-6 !text-sm !font-normal  !capitalize !w-full !justify-start flex gap-3">
                  <span className="block w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                  Add Category
                </Button>
              </li>
            </Link>
            <Link to={"/admin/sub-category-list"}>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !pl-6 !text-sm !font-normal  !capitalize !w-full !justify-start flex gap-3">
                  <span className="block w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                  Sub Category List
                </Button>
              </li>
            </Link>
            <Link to={"/admin/sub-category-add"}>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !pl-6 !text-sm !font-normal  !capitalize !w-full !justify-start flex gap-3">
                  <span className="block w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                  Add Sub Category
                </Button>
              </li>
            </Link>
          </ul>
        </Collapse>
      </li> */}
      <li>
        <Link to="/admin/orders-list">
          <Button className="w-full !capitalize !justify-start flex gap-3 text-xs !text-[rgba(0,0,0,0.8)] !font-semibold items-center !py-2 ">
            <IoBagCheckOutline className="text-base" />
            <span className="">Orders</span>
          </Button>
        </Link>
      </li>{" "}
      <li>
        <Button
          onClick={handleLogout}
          disabled={loading}
          className="w-full !capitalize !justify-start flex gap-3 text-xs !text-[rgba(0,0,0,0.8)] !font-semibold items-center !py-2 "
        >
          <IoMdLogOut className="text-base" />
          <span className="">{loading ? "Logging out..." : "Logout"}</span>
        </Button>
      </li>
    </ul>
  );
};

export default memo(AdminSidebarUL);
