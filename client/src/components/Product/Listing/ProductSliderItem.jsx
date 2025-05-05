import React, { memo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FaCodeCompare, FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdZoomOutMap } from "react-icons/md";
import { ProductQuickViewModel } from "../../";
import useReduxHooks from "../../../hooks/useReduxHooks";
import toast from "react-hot-toast";

function ProductSliderItem({ product }) {
  const { cartActions, dispatch, wishlistActions, auth } = useReduxHooks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isUserLoggedIn = auth?.status || false;

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!isUserLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(cartActions.addToCart(product));
  }, [dispatch, cartActions]);

  const imageUrl =
    product.images && product.images[0]
      ? product.images[0].url
      : "/default-image.jpg";

  return (
    <div className="rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)] shadow-lg">
      <div className="w-full overflow-hidden laptop:h-64 h-[10rem] rounded-md relative group cursor-pointer">
        <Link to={`/product/${product._id}`}>
          <img
            className="object-cover w-full h-full"
            src={imageUrl}
            alt={product.name || "Product Image"}
          />
        </Link>
        <span className="flex items-center absolute top-2 left-2 z-50 bg-primary text-white rounded-md p-2 laptop:text-sm text-xs font-medium">
          -{product.discount}%
        </span>
        <div className="actions absolute -top-52 group-hover:top-4 right-1 z-50 flex items-center gap-1 flex-col w-12 transition-all ease-in-out duration-300">
          <Tooltip title="Add to Wishlist" arrow placement="left">
            <Button
              className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
              onClick={() => {
                if (!isUserLoggedIn) {
                  toast.error("Please login to add items to wishlist");
                  return;
                }
                dispatch(wishlistActions?.addTowishlist(product));
              }}
            >
              <FaRegHeart className="text-lg" />
            </Button>
          </Tooltip>
          <Tooltip title="Add to Cart" arrow placement="left">
            <Button
              onClick={handleAddToCart}
              className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
            >
              <MdOutlineShoppingCart className="text-lg" />
            </Button>
          </Tooltip>

          <Tooltip title="Quick View" arrow placement="left">
            <Button
              className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
              onClick={handleOpenModal}
            >
              <MdZoomOutMap className="text-lg" />
            </Button>
          </Tooltip>
          <ProductQuickViewModel
            product={product}
            openModel={isModalOpen}
            handleClose={handleCloseModal}
          />
        </div>
      </div>
      <div className="p-3 bg-[#f1f1f1]">
        <h3 className="laptop:text-sm text-xs font-normal">
          <Link className="link transition-all" to={`/product/${product._id}`}>
            {product.name && product.name.substring(0, 50)}...
          </Link>
        </h3>
        <h4 className="laptop:text-base text-sm mb-1 font-medium mt-1">
          <Link className="link transition-all" to={`/product/${product._id}`}>
            {product.description && product.description.substring(0, 60)}...
          </Link>
        </h4>
        <Rating
          name="half-rating-read"
          defaultValue={product.rating || 0}
          precision={0.5}
          size="small"
          readOnly
        />
        <div className="flex items-center laptop:gap-4 gap-1">
          <span className="line-through text-gray-500 laptop:text-base text-sm">
            {product.oldPrice} <span className="">Pkr</span>
          </span>
          <span className="text-[#3238f2] font-medium ml-2 laptop:text-base text-sm">
            {product.price} <span className="text-[#3238f2]">Pkr</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductSliderItem);
