import React, { memo, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { IoBagOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaRegAddressBook } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import avatar from "../../assets/avatar.png";
import useReduxHooks from "../../hooks/useReduxHooks";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

const MyAccountSidebar = () => {
  const { auth, authActions, dispatch } = useReduxHooks();
  const { apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const userData = auth?.userData;

  const menuItems = [
    {
      to: "/my-profile",
      icon: <FaRegUser className="laptop:text-lg text-sm tablet:text-base" />,
      label: "My Profile",
    },
    {
      to: "/my-wishlist",
      icon: <FaRegHeart className="laptop:text-lg text-sm tablet:text-base" />,
      label: "My Wishlist",
    },
    {
      to: "/my-orders",
      icon: (
        <IoBagOutline className="laptop:text-lg text-sm tablet:text-base" />
      ),
      label: "My Orders",
    },
    {
      to: "/my-address",
      icon: (
        <FaRegAddressBook className="laptop:text-lg text-sm tablet:text-base" />
      ),
      label: "My Address",
    },
  ];

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (
      !file ||
      !["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
        file.type
      )
    )
      return;

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiSubmit({
      url: apis().userUpdateAvatar.url,
      method: apis().userUpdateAvatar.method,
      values: formData,
      showLoadingToast: true,
      loadingMessage: "Uploading image..., Please wait!",
    });

    if (response.success) {
      dispatch(authActions.setUserAvatar(response.data.avatar.url));
    }
  };

  return (
    <div className="card bg-white shadow-md rounded-md sticky top-3">
      <div className="w-full p-5 flex items-center justify-center flex-col">
        <div className="w-28 h-28 rounded-full overflow-hidden mb-4 relative group ">
          {userData?.avatar?.url ? (
            <img
              src={userData?.avatar?.url}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <img src={avatar} className="w-full h-full object-cover" alt="" />
          )}

          <div className="overlay w-full h-full absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
            <FaCloudUploadAlt className="text-[#fff] text-xl" />
            <input
              type="file"
              accept="image/*"
              name="avatar"
              onChange={(e) => handleProfileImageUpload(e)}
              id="avatar"
              className="absolute top-0 left-0 w-full h-full opacity-0"
            />
          </div>
        </div>
        {!userData?.avatar?.url && (
          <span className="text-gray-700 text-xs laptop:text-sm text-center">
            Upload an avatar if you want to change your profile picture
          </span>
        )}
        <h3>{userData?.name || "No Name"}</h3>
        <span className="text-xs font-medium ">
          {userData?.email || "No Email"}
        </span>
      </div>
      <ul className="pb-5 bg-[#f1f1f1]">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full">
            <NavLink to={item.to}>
              {({ isActive }) => (
                <Button
                  variant="text"
                  className={`flex !items-center !py-2 !justify-start !px-5 !text-left !capitalize gap-2 !w-full !rounded-none ${
                    isActive
                      ? "!text-primary font-bold bg-[rgba(0,0,0,0.1)]"
                      : "!text-[rgba(0,0,0,0.8)]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Button>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(MyAccountSidebar);
