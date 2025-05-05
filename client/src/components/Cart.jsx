import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart = "absolute bottom-[0px] right-[15px]" }) {
  return (
    <Link to="/cart">
      <i className={`fa-solid fa-cart-shopping w-10 h-10 rounded-[50px] content-center text-center bg-[#cce7d0] text-primary ${cart}`}></i>
    </Link>
  );
}

export default Cart;
