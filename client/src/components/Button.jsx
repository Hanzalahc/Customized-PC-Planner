import React from "react";
import { Link } from "react-router-dom";

const Button = ({
  desc = "Pre-Built Gaming PCs",
  className = "",
  src = "/pre-build",
}) => {
  return (
    <Link to={src} className={`main-btn ${className} capitalize`}>
      <span>{desc}</span>
      <i></i>
    </Link>
  );
};

export default Button;
