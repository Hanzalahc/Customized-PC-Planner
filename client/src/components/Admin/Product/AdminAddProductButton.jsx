import { Button } from "@mui/material";
import React, { memo } from "react";
import { Link } from "react-router-dom";

const AdminAddProductButton = ({
  src = "/admin/product-add",
  content = "+ Add Product",
}) => {
  return (
    <Link to={src}>
      <Button className="!bg-[#3872fa] !text-[#fff] hover:!bg-[#3067e5] !capitalize    ">
        {content}
      </Button>
    </Link>
  );
};

export default memo(AdminAddProductButton);
