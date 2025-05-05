import React, { memo } from "react";
import checkIcon from "../../assets/check.png";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-2">
      <img src={checkIcon} alt="check" className="w-28" />
      <h2 className="mb-0 laptop:text-2xl tablet:text-xl text-lg text-center">
        Your order has been placed successfully. You will receive an email with
        the order details.
      </h2>
      <p
        className="laptop:mt-0 mt-3 text-center
      "
      >
        Thank you for shopping with us. Please feel free to contact us if you
        have any questions.
      </p>
      <NavLink to="/">
        <Button
          variant="contained"
          className="!bg-primary hover:!bg-black flex gap-2 !text-white !w-full "
        >
          Back to Home
        </Button>
      </NavLink>
    </section>
  );
};

export default OrderSuccess;
