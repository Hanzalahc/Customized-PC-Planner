import React from "react";
import { Link } from "react-router-dom";

const BuyButton = ({ desc = "Custom Build", src = "/custom-build" }) => {
  return (
    <Link to={src}>
      <button className="ml-4 inline-flex text-gray-800 bg-gray-100 border border-gray-400 hover:border-black hover:text-white py-2 px-6 focus:outline-none hover:bg-primary  rounded text-lg motion-scale-in-[0.5] motion-translate-x-in-[-120%] motion-translate-y-in-[-60%] motion-opacity-in-[33%] motion-rotate-in-[-1080deg] motion-blur-in-[10px] motion-delay-[0.38s]/scale motion-duration-[0.38s]/opacity motion-duration-[1.20s]/rotate motion-duration-[0.15s]/blur motion-delay-[0.60s]/blur motion-ease-spring-bouncier">
        {desc}
      </button>
    </Link>
  );
};

export default BuyButton;
