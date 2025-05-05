import React, { memo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdZoomOutMap } from "react-icons/md";
import { ProductQuickViewModel } from "../../";
import useReduxHooks from "../../../hooks/useReduxHooks";
import toast from "react-hot-toast";

const ProductListView = ({ product }) => {
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
    <div className="rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)] shadow-lg flex items-center flex-col laptop:flex-row">
      <div className="laptop:w-[25%] w-full overflow-hidden h-64 rounded-md relative group cursor-pointer">
        <Link to={`/product/${product._id}`}>
          <img
            className="object-cover w-full h-full"
            src={imageUrl}
            alt={product?.name}
          />
        </Link>
        <span className="flex items-center absolute top-2 left-2 z-50 bg-primary text-white rounded-md p-2 laptop:text-sm text-xs font-medium">
          -{product.discount}%
        </span>
        <div className="actions absolute -top-52 group-hover:top-4 right-1 z-50 flex items-center gap-1 flex-col w-12 transition-all ease-in-out duration-300">
          <Tooltip title="Add to Wishlist" arrow placement="left">
            <Button
              onClick={() => {
                if (!isUserLoggedIn) {
                  toast.error("Please login to add items to wishlist");
                  return;
                }
                dispatch(wishlistActions?.addTowishlist(product));
              }}
              className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
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
            openModel={isModalOpen}
            handleClose={handleCloseModal}
            product={product}
          />
        </div>
      </div>
      <div className="p-3 bg-[#f1f1f1] w-full laptop:w-[75%] ">
        <h3 className="laptop:text-sm text-xs font-normal text-left">
          <Link className="link transition-all" to={`/product/${product._id}`}>
            {product?.name}
          </Link>
        </h3>
        <h4 className="laptop:text-base text-sm font-medium mt-3 mb-3">
          <Link className="link transition-all" to={`/product/${product._id}`}>
            {product.description && product.description.substring(0, 250)}...
          </Link>
        </h4>

        <p className="text-sm mb-3">{product?.brand}</p>
        <Rating
          name="half-rating-read"
          defaultValue={product?.rating}
          precision={0.5}
          size="small"
          readOnly
        />
        <div className="flex items-center gap-4">
          <span className="line-through text-gray-500 laptop:text-base text-sm">
            {product.oldPrice} <span className="">Pkr</span>
          </span>
          <span className="text-[#FF5252] font-medium ml-2 laptop:text-base text-sm">
            {product.price} <span className="text-[#FF5252]">Pkr</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductListView);
