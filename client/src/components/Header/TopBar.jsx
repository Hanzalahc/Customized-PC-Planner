import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="p-3 flex bg-white justify-between items-center top-0 left-0 right-0 z-20 shadow-md">
      {/* Logo */}
      <NavLink to="/" id="brand" className="flex gap-2 items-center flex-1">
        <span className="text-lg font-medium font-display text-black">
          <span className="text-primary"> &lt;</span>
          Customized PC Planner
          <span className="text-primary">/&gt;</span>
        </span>
      </NavLink>

      {/* Large screen menu */}
      <div id="nav-menu" className="hidden lg:flex gap-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/components"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          Components
        </NavLink>
        <NavLink
          to="/custom-Build"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          Custom Build
        </NavLink>
        <NavLink
          to="/compatibility"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          Compatibility
        </NavLink>
        <NavLink
          to="/benchmarks"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          Benchmarks
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Pre-built Machines button */}
      <div className="hidden lg:flex flex-1 justify-end">
        <NavLink
          to="/pre-build"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-primary"
              : "font-medium hover:text-primary"
          }
        >
          <button className="flex gap-2 items-center border border-gray-400 px-6 py-2 rounded-lg hover:border-gray-600">
            <lord-icon
              src="https://cdn.lordicon.com/ogjpwrxe.json"
              trigger="hover"
              colors="primary:#121331,secondary:#3238f2"
              style={{ width: 20, height: 30 }}
            />

            <span className="font-display font-medium">Pre-built Machines</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </NavLink>
      </div>

      {/* Hamburger icon for mobile */}
      <button className="p-2 lg:hidden" onClick={handleMenu}>
        <i className="fa-solid fa-bars text-gray-600"></i>
      </button>

      {/* Mobile menu */}
      <div
        id="nav-dialog"
        className={`${
          menuOpen ? "" : "hidden"
        } fixed z-10 bg-white inset-0 p-3 md:hidden`}
      >
        {/* Logo */}
        <div id="nav-bar" className="flex justify-between">
          <NavLink to="/" id="brand" className="flex gap-2 items-center">
            <span className="text-lg font-medium font-display">
              Customized PC Planner
            </span>
          </NavLink>
          <button className="p-2 md:hidden" onClick={handleMenu}>
            <i className="fa-solid fa-xmark text-gray-600"></i>
          </button>
        </div>

        {/* Menu List */}
        <div className="mt-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-medium m-3 p-3 bg-gray-100 block rounded-lg"
                : "font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/components"
            className={({ isActive }) =>
              isActive
                ? "font-medium m-3 p-3 bg-gray-100 block rounded-lg"
                : "font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
            }
          >
            Components
          </NavLink>
          <NavLink
            to="/custom-build"
            className={({ isActive }) =>
              isActive
                ? "font-medium m-3 p-3 bg-gray-100 block rounded-lg"
                : "font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
            }
          >
            Custom Build
          </NavLink>
          <NavLink
            to="/compatibility"
            className={({ isActive }) =>
              isActive
                ? "font-medium m-3 p-3 bg-gray-100 block rounded-lg"
                : "font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
            }
          >
            Compatibility
          </NavLink>
          <NavLink
            to="/benchmarks"
            className={({ isActive }) =>
              isActive
                ? "font-medium m-3 p-3 bg-gray-100 block rounded-lg"
                : "font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
            }
          >
            Benchmarks
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "font-medium m-3 p-3 bg-gray-100 block rounded-lg"
                : "font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "font-medium m-3 p-3 bg-gray-100 block rounded-lg"
                : "font-medium m-3 p-3 hover:bg-gray-50 block rounded-lg"
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Button */}
        <div className="h-[1px] bg-gray-300"></div>
        <NavLink to="/pre-build">
          <button className="mt-6 w-full flex gap-2 items-center px-6 py-4 rounded-lg hover:bg-gray-50">
            <i className="fa-solid fa-computer"></i>
            <span className="font-medium">Pre-built Machines</span>
          </button>
        </NavLink>
      </div>
    </nav>
  );
}

export default TopBar;
