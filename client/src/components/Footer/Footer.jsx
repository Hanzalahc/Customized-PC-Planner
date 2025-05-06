import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="px-6 py-12 max-w-7xl mt-16 mx-auto lg:px-8 lg:mt-10 section">
      <div className="rounded-lg border lg:border-none lg:bg-gray-50 bg-gray-50 flex flex-col lg:flex-row-reverse items-center px-8 py-12 gap-8">
        <Link
          to="https://github.com/Hanzalahc/Customized-PC-Planner"
          className="font-light font-display"
        >
          Check Documentation
        </Link>
        <div className="flex gap-8 text-lg">
          <Link to="#" className="text-gray-600 hover:text-gray-900">
            <i className="fa-brands fa-twitter"></i>
          </Link>
          <Link to="https://github.com/Hanzalahc/Customized-PC-Planner" className="text-gray-600 hover:text-gray-900">
            <i className="fa-brands fa-github"></i>
          </Link>
        </div>
        <Link to="/" id="brand" className="flex gap-2 items-center flex-1">
          <span className="text-lg font-medium font-display text-black">
            <span className="text-primary"> &lt;</span>
            Customized PC Planner
            <span className="text-primary">/&gt;</span>
          </span>
        </Link>
      </div>
      <div
        id="sub-footer"
        className="flex flex-col gap-6 items-center justify-center my-12"
      >
        <div className="flex gap-2 items-center">
          <p className="text-sm text-gray-600">
            Your trusted partner in building the perfect PC, offering expert
            recommendations, component compatibility checks, and easy
            purchasing—all in one place.
          </p>
        </div>
        <p className="text-sm text-gray-400">
          © 2024 Customized PC Planner, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
