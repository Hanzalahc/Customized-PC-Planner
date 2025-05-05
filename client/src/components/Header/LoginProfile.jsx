import { Button } from "@mui/material";
import React, { memo, useCallback, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoBagOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { FaRegAddressBook } from "react-icons/fa";
import avatar from "../../assets/avatar.png";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "../../hooks/useReduxHooks";

const LoginProfile = () => {
  const { Link, apis } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, authActions, auth } = useReduxHooks();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userAuthData = auth?.userData || {};

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuItems = [
    {
      to: "/my-profile",
      icon: <FaRegUser className="text-lg" />,
      text: "My Profile",
    },
    {
      to: "/my-orders",
      icon: <IoBagOutline className="text-lg" />,
      text: "Orders",
    },
    {
      to: "/my-wishlist",
      icon: <FaRegHeart className="text-lg" />,
      text: "Wishlist",
    },
    {
      to: "/my-address",
      icon: <FaRegAddressBook className="text-lg" />,
      text: "My Address",
    },
  ];

  const handleLogout = async () => {
    const logoutResponce = await apiSubmit({
      url: apis().userLogout.url,
      method: apis().userLogout.method,
      showLoadingToast: true,
      loadingMessage: "Logging out..., Please wait!",
    });

    if (logoutResponce.success) {
      dispatch(authActions.logout());
    }
  };

  return (
    <>
      <div className="myacc flex items-center gap-3  ">
        <Button className="!w-10 !h-10 !min-w-10 !rounded-full !bg-[#f1f1f1]">
          {userAuthData?.avatar?.url ? (
            <img
              onClick={handleClick}
              src={userAuthData?.avatar?.url}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <img
              onClick={handleClick}
              src={avatar}
              className="w-full h-full object-cover"
              alt=""
            />
          )}
        </Button>

        <div
          onClick={handleClick}
          className="info  flex-col hidden laptop:flex "
        >
          <h4 className="text-xs font-medium mb-0">
            {userAuthData?.name || "Name"}
          </h4>
          <span className="text-xs ">{userAuthData?.email || "Email"}</span>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={handleClose} className="flex gap-2">
            <Link className="link flex gap-2 w-full" to={item.to}>
              {item.icon} {item.text}
            </Link>
          </MenuItem>
        ))}
        <MenuItem
          disabled={loading}
          onClick={() => {
            handleClose();
            handleLogout();
          }}
          className="flex gap-2"
        >
          <Link className="link flex items-center gap-2 w-full">
            <IoIosLogOut className="text-lg" />
            {loading ? "Logging out..." : "Logout"}
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

export default memo(LoginProfile);
