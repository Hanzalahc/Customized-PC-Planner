import React, { memo } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { MdOutlineShoppingCart } from "react-icons/md";
import useReduxHooks from "../../hooks/useReduxHooks";
import toast from "react-hot-toast";
const MyWishlist = () => {
  const { wishlist, cartActions, wishlistActions, dispatch, auth } =
    useReduxHooks();

  const wishlistItems = wishlist?.wishlist || [];
  const isUserLoggedIn = auth?.status || false;

  const defaultImage =
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/32-home_default/brown-bear-printed-sweater.jpg";

  const handleAddToCart = (product) => {
    if (!isUserLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(cartActions.addToCart(product));
  };

  return (
    <div className="card shadow-md rounded-md bg-white">
      <div className="py-5 px-3 border-b border-[rgba(0,0,0,0.1)] ">
        <h2 className="laptop:text-xl text-lg font-semibold">Your Wishlist</h2>
        <p className="mt-0">
          There are{" "}
          <span className="text-sm text-primary font-semibold">
            {wishlistItems.length || 0}
          </span>{" "}
          items in your wishlist.
        </p>
        <div className="flex items-end justify-end mb-4 ">
          <Button
            onClick={() => dispatch(wishlistActions.clearwishlist())}
            sx={{
              backgroundColor: "#3238f2",
              color: "#fff",
              fontWeight: "600",
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#000000",
              },
            }}
            className="!text-sm laptop:!text-base"
          >
            Clear Wishlist
          </Button>
        </div>
      </div>

      {wishlistItems?.length !== 0 ? (
        wishlistItems?.map((item) => (
          <div
            key={item?._id}
            className="cartitem w-full p-3 flex items-center gap-4 pb-4 border-b border-[rgba(0,0,0,0.1)]"
          >
            <div className="img w-[15%] rounded-md overflow-hidden">
              <Link to={`/product/${item?._id}`} className="group">
                <img
                  src={item?.images[0]?.url || defaultImage}
                  className="w-full group-hover:scale-105 transition-all"
                  alt={item?.name}
                />
              </Link>
            </div>
            <div className="info w-[85%] relative">
              <IoCloseSharp
                onClick={() =>
                  dispatch(wishlistActions.removeFromwishlist(item?._id))
                }
                className="link absolute right-2 text-base transition-all top-2 cursor-pointer"
              />
              <span className="text-sm">{item?.brand}</span>
              <h3 className="text-base font-semibold">
                <Link to={`/product/${item?._id}`} className="link">
                  {item?.name || "Product Name"}
                </Link>
              </h3>
              <Rating
                name="read-only"
                value={item?.rating}
                size="small"
                readOnly
              />

              <div className="flex items-center gap-4 my-2">
                <span className="line-through text-gray-500 text-sm">
                  {item?.oldPrice} <span className="text-sm ">PKR</span>
                </span>
                <span className="text-gray-500 font-medium ml-2 text-sm">
                  {item?.price}{" "}
                  <span className="text-sm text-gray-500">PKR</span>
                </span>
                <span className="text-[#3238f2] font-medium ml-2 text-sm">
                  {item?.discount}%{" "}
                  <span className="text-sm text-[#3238f2]">OFF</span>
                </span>
              </div>
              <Button
                onClick={() => handleAddToCart(item)}
                className="!bg-primary hover:!bg-black !text-sm flex gap-2 !text-white"
              >
                <MdOutlineShoppingCart className="text-sm text-white" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center py-5">
          <p className="text-gray-500">Your wishlist is empty</p>
        </div>
      )}
    </div>
  );
};

export default memo(MyWishlist);
