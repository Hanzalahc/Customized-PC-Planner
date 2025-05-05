import React, { memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { IoCloseSharp } from "react-icons/io5";
import { ProductRightSideContent, ProductZoom } from "../";

const ProductQuickViewModel = ({ openModel, handleClose, product }) => {
  return (
    <Dialog
      open={openModel}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="product-quickview"
    >
      <DialogContent>
        <div className="flex items-center w-full relative">
          <Button
            className="!w-10 !h-10 !min-w-10 !rounded-full !text-black !absolute top-0 right-0"
            onClick={handleClose}
          >
            <IoCloseSharp />
          </Button>
          <div className="col1 w-[40%]">
            <ProductZoom product={product} />
          </div>
          <div className="col2 w-[60%] pr-10 pl-10">
            <ProductRightSideContent product={product} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProductQuickViewModel);
