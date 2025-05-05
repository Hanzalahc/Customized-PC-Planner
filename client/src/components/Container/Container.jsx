import React from "react";

function Container({ children, className }) {
  return <section className={className}>{children}</section>;
}

export default Container;
