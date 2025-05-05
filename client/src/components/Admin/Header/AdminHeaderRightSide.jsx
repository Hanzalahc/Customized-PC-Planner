import React, { memo, useCallback } from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FaRegBell } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import { Avatar } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import useReduxHooks from "./../../../hooks/useReduxHooks";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const AdminHeaderRightSide = () => {
  const { admin } = useReduxHooks();
  const adminData = admin;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [anchorEl]);
  return (
    <div className="part2 w-[40%] flex items-center justify-end gap-5">
      <IconButton aria-label="cart">
        <StyledBadge badgeContent={4} color="secondary">
          <FaRegBell />
        </StyledBadge>
      </IconButton>
      <div className="relative">
        <div
          className="circle rounded-full w-9 h-9 overflow-hidden cursor-pointer"
          onClick={handleClick}
        >
          {adminData?.avatar ? (
            <img
              src={adminData.avatar}
              alt="Admin Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <Avatar className="w-full h-full" />
          )}
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
          <MenuItem onClick={handleClose} className="!bg-white">
            <div className="flex items-center gap-3">
              <div className="circle rounded-full w-9 h-9 overflow-hidden cursor-pointer">
                {adminData?.avatar ? (
                  <img
                    src={adminData?.avatar}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar className="w-full h-full" />
                )}
              </div>
              <div className="info ">
                <h4 className="text-base font-medium">{adminData?.name}</h4>
                <p className="text-xs font-normal">{adminData?.email}</p>
              </div>
            </div>
          </MenuItem>
          <Divider />
        </Menu>
      </div>
    </div>
  );
};

export default memo(AdminHeaderRightSide);
