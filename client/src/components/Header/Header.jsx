import React from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

const Header = () => {
  return (
    <header>
      {/* Top bar */}
      <TopBar></TopBar>
      {/* Bottom bar */}
      <BottomBar></BottomBar>
    </header>
  );
};

export default Header;
