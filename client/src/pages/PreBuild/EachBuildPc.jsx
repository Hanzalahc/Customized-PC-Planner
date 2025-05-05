import React from "react";
import { Link } from "react-router-dom";
import Cart from "../../components/Cart";

function EachBuildPc({
  src,
  alt,
  h3,
  span,
  price,
}) {
  return (
    <div className="card w-fit min-w-[200px] p-6 rounded-[25px] border border-gray-200 shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-transparent hover:ring-2 hover:ring-gray-300">
      <Link to="/single-product">
        <img
          src={src}
          alt={alt}
          className="h-[300px] w-[300px]  rounded-[20px] object-contain bg-primary pb-[7px]"
        />
      </Link>
      {/* text wrapper */}
      <div className="text-start px-[10px] my-[7px] relative">
        <span className="text-base text-gray-800">{span}</span>
        <h3 className="text-base lg:text-lg font-semibold pt-[7px]">{h3}</h3>
        {/* star icon wrapper */}
        <div className="reviews">
          <i className="fas fa-star text-sm text-yellow-500"> </i>
          <i className="fas fa-star text-sm text-yellow-500"> </i>
          <i className="fas fa-star text-sm text-yellow-500"> </i>
          <i className="fas fa-star text-sm text-yellow-500"></i>
          <i className="fas fa-star text-sm text-yellow-500"></i>
        </div>
        <h4 className="pt-[7px] text-sm font-bold">{price}</h4>
        {/* add to cart icon */}
        <Cart />
      </div>
    </div>
  );
}

export default EachBuildPc;
