import React, { memo, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import useReduxHooks from "../../hooks/useReduxHooks";
import useProvideHooks from "../../hooks/useProvideHooks";
import { Button } from "@mui/material";

const CartLeftSide = () => {
  const { cart, cartActions, dispatch, auth } = useReduxHooks();
  const { showSuccess, showError } = useProvideHooks();

  const cartItems = cart?.cart || [];
  const isUserLoggedIn = auth?.status || false;

  const [selectedQty, setSelectedQty] = useState(1);

  const handleRemoveCart = (id) => {
    if (!isUserLoggedIn) {
      showError("Please login to remove items from cart");
      return;
    }
    dispatch(cartActions.removeFromCart(id));
  };

  const handleQtyClose = (qty, itemId, stock) => {
    if (qty > stock) {
      showError("Quantity is greater than the remaning stock");
      return;
    }

    setSelectedQty(qty);
    dispatch(cartActions.updateQuantity({ id: itemId, quantity: qty }));
  };

  return (
    <div className="left w-full laptop:w-[75%]">
      <h2>Your Cart</h2>
      <p className="mt-0">
        There are{" "}
        <span className="text-sm text-primary font-semibold">
          {isUserLoggedIn ? cartItems.length : 0}{" "}
        </span>{" "}
        items in your cart.
      </p>
      <div className="flex items-end justify-end mb-4 ">
        <Button
          onClick={() => {
            if (!isUserLoggedIn) {
              showError("Please login to remove items from cart");
              return;
            }
            dispatch(cartActions.clearCart());
          }}
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
        >
          Clear Cart
        </Button>
      </div>

      <div className="card shadow-md rounded-md bg-white">
        {isUserLoggedIn && cartItems?.length !== 0 ? (
          cartItems?.map((item) => (
            <div
              key={item?._id}
              className="cartitem w-full p-3 flex items-center gap-4 pb-4 border-b border-[rgba(0,0,0,0.1)]"
            >
              <div className="img laptop:w-[15%] w-[30%] rounded-md overflow-hidden">
                <Link to={`/product/${item?._id}`}>
                  <img
                    src={
                      item.images && item.images[0]?.url
                        ? item.images[0].url
                        : "/default-image.jpg"
                    }
                    alt={item.name}
                    className="w-full group-hover:scale-105 transition-all"
                  />
                </Link>
              </div>
              <div className="info laptop:w-[85%] w-[70%] relative">
                <IoCloseSharp
                  onClick={() => handleRemoveCart(item._id)}
                  className="link absolute right-2 text-base transition-all top-2 cursor-pointer"
                />
                <span className="text-sm">{item.brand}</span>
                <h3 className="tablet:text-base text-xs font-semibold">
                  <Link to={`/product/${item?._id}`} className="link">
                    {item?.name && item?.name.length > 60 ? (
                      <>{item?.name.slice(0, 60)}...</>
                    ) : (
                      item?.name
                    )}
                  </Link>
                </h3>
                <Rating
                  name="read-only"
                  value={item.rating || 0}
                  size="small"
                  readOnly
                />
                <div className="menu flex items-center gap-4 mt-2">
                  <div className="relative">
                    <Select
                      className="text-sm tablet:text-base font-medium"
                      classNamePrefix="select"
                      isSearchable={true}
                      defaultValue={{
                        value: item.quantity || selectedQty,
                        label: item.quantity || selectedQty,
                      }}
                      name="color"
                      options={
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((qty) => ({
                          value: qty,
                          label: qty,
                        })) || []
                      }
                      placeholder="Select Quantity"
                      onChange={(e) => {
                        handleQtyClose(e.value, item._id, item?.stock);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="line-through text-gray-500 text-sm">
                    {item.oldPrice} <span className="text-sm">PKR</span>
                  </span>
                  <span className="text-gray-500 font-medium ml-2 text-sm">
                    {item.price}{" "}
                    <span className="text-sm text-gray-500">PKR</span>
                  </span>
                  <span className="text-primary font-medium ml-2 text-sm">
                    {item.discount}%{" "}
                    <span className="text-sm text-primary">OFF</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="cartitem w-full p-3 flex items-center gap-4 pb-4 border-b border-[rgba(0,0,0,0.1)]">
            <p>No items in cart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CartLeftSide);
