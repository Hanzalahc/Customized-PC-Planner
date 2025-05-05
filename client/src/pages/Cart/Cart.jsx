import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { CartLeftSide } from "../../components/";
import useReduxHooks from "../../hooks/useReduxHooks";
import { Button } from "@mui/material";
import useProvideHooks from "../../hooks/useProvideHooks";

const Cart = () => {
  const { cart } = useReduxHooks();
  const { navigate } = useProvideHooks();

  const cartItems = cart?.cart || [];

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <section className="py-4 laptop:py-8 pb-10">
      <div className="mx-auto w-[80%] flex gap-5 flex-col laptop:flex-row ">
        <CartLeftSide />
        <div className="right w-full laptop:w-[25%]">
          <div className="card shadow-md rounded-md bg-white">
            <div className="p-4 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-semibold">Order Summary</h3>
            </div>
            <div className="p-4 border-b border-[rgba(0,0,0,0.1)]">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">{totalPrice} PKR</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">Free</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm">Tax</span>
                <span className="text-sm">Included</span>
              </div>
            </div>
            <div className="p-4 border-b border-[rgba(0,0,0,0.1)]">
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="text-sm">{totalPrice} PKR</span>
              </div>
            </div>
            <div className="p-4">
              <Button
                onClick={handleCheckout}
                className="!w-full !bg-primary !text-white hover:!bg-black text-center !py-2 !rounded-md block"
              >
                Proceed to Checkout
              </Button>

              <Link
                to={`/`}
                className="w-full bg-gray-200 text-gray-700 hover:bg-black hover:text-gray-300 text-center py-2 rounded-md block mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Cart);
