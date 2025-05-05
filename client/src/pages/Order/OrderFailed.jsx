import React, { memo } from "react";
import deleteIcon from "../../assets/delete.png";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const OrderFailed = () => {
  return (
    <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-2">
      <img src={deleteIcon} alt="check" className="w-28" />
      <h2 className="mb-0 laptop:text-2xl tablet:text-xl text-lg text-center">
        Your order is failed. Please try again.
      </h2>
      <p
        className="laptop:mt-0 mt-3 text-center
      "
      >
        If you have any questions, please feel free to contact us.
      </p>
      <NavLink to="/checkout">
        <Button
          variant="contained"
          className="!bg-primary hover:!bg-black flex gap-2 !text-white !w-full"
        >
          Check Out Again
        </Button>
      </NavLink>
    </section>
  );
};

export default OrderFailed;
