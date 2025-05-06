import React, { memo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
// import { MdZoomOutMap } from "react-icons/md";
// import Cart from "../../components/Cart";
import useReduxHooks from "../../hooks/useReduxHooks";
import toast from "react-hot-toast";

function EachBuildPc({ product }) {
  const { cartActions, dispatch, wishlistActions, auth } = useReduxHooks();

  const isUserLoggedIn = auth?.status || false;

  const handleAddToCart = useCallback(() => {
    if (!isUserLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(cartActions.addToCart(product));
  }, [dispatch, cartActions]);

  const handleAddToWishlist = useCallback(() => {
    if (!isUserLoggedIn) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    dispatch(wishlistActions.addTowishlist(product));
  }, [dispatch, wishlistActions]);

  const imageUrl = product.images?.[0]?.url || "/default-image.jpg";

  return (
    <div className="relative group w-[300px] rounded-[25px] border border-gray-200 shadow-xl overflow-hidden bg-white">
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="h-[300px] w-[300px] rounded-[20px] object-contain bg-primary pb-[7px]"
          />
        </Link>

        {/* Hover Buttons */}
        <div className="actions absolute -top-52 group-hover:top-4 right-1 z-50 flex items-center gap-1 flex-col w-12 transition-all ease-in-out duration-300">
          <Tooltip title="Add to Wishlist" arrow placement="left">
            <Button
              className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
              onClick={handleAddToWishlist}
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
        </div>
      </div>

      {/* Product Info */}
      <div className="text-start px-4 py-3 bg-[#f1f1f1]">
        <h3 className="text-base text-gray-800 font-semibold line-clamp-1">
          {`${product.components.cpu.model} - ${product.components.gpu.model}`}
        </h3>
        <p className="text-sm text-gray-600 mb-1 line-clamp-2">
          {product.name}
        </p>
        <Rating
          name="half-rating-read"
          defaultValue={product.rating || 0}
          precision={0.5}
          size="small"
          readOnly
        />
        <div className="flex items-center gap-2 mt-1">
          <span className="line-through text-gray-500 text-sm">
            {product.oldPrice} Pkr
          </span>
          <span className="text-[#3238f2] font-medium text-base">
            {product.price} Pkr
          </span>
        </div>
      </div>
    </div>
  );
}

export default EachBuildPc;
