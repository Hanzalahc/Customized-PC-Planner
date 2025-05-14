import { lazy } from "react";

// Eagerly loaded critical pages
import Home from "./Home/Home";
import Pagenotfound from "./Pagenotfound";

// Lazily loaded non-critical pages

import About from "./About/About";
import Benchmarks from "./Benchmarks/Benchmarks";
import Cart from "./Cart/Cart";
import Case from "./ComponentsPage/Case/Case";
import Checkout from "./Checkout/Checkout";
import Components from "./ComponentsPage/Components";
import Compatibility from "./Compatibility/Compatibility";
import Contact from "./Contact/Contact";
import Cpu from "./ComponentsPage/Cpu/Cpu";
import CpuBenchmarks from "./Benchmarks/CpuBenchmarks/CpuBenchmarks";
import CpuCooler from "./ComponentsPage/CpuCooler/CpuCooler";
import CustomBuild from "./CustomBuild/CustomBuild";
import Gpu from "./ComponentsPage/Gpu/Gpu";
import GpuBenchmarks from "./Benchmarks/GpuBenchmarks/GpuBenchmarks";
import MotherBoard from "./ComponentsPage/MotherBoard/MotherBoard";
import PreBuild from "./PreBuild/PreBuild";
import Psu from "./ComponentsPage/Psu/Psu";
import Ram from "./ComponentsPage/Ram/Ram";
import Signin from "./AuthPages/Signin";
import Signup from "./AuthPages/Signup";
import ForgotPassword from "./AuthPages/ForgotPassword";
import ChangePassword from "./AuthPages/ChangePassword";
import Storage from "./ComponentsPage/Storage/Storage";
import MyAccount from "./Profile/MyAccount";
import MyAddressPage from "./Profile/MyAddressPage";
import MyOrdersPage from "./Profile/MyOrdersPage";
import MyWishlistPage from "./Profile/MyWishlistPage";
import OrderSuccess from "./Order/OrderSuccess";
import OrderFailed from "./Order/OrderFailed";
import SearchResults from "./SearchPage/SearchResults";
import VerifyEmailLink from "./AuthPages/VerifyEmailLink";
import VerifyPassLink from "./AuthPages/VerifyPassLink";
import ProductDetails from "./Product/ProductDetails";

export {
  Home,
  About,
  Benchmarks,
  Cart,
  Case,
  Checkout,
  Components,
  Compatibility,
  Contact,
  Cpu,
  CpuBenchmarks,
  CpuCooler,
  CustomBuild,
  Gpu,
  GpuBenchmarks,
  MotherBoard,
  PreBuild,
  Psu,
  Ram,
  Signin,
  Signup,
  ForgotPassword,
  ChangePassword,
  Storage,
  Pagenotfound,
  MyAccount,
  MyAddressPage,
  MyOrdersPage,
  MyWishlistPage,
  OrderSuccess,
  OrderFailed,
  SearchResults,
  VerifyEmailLink,
  VerifyPassLink,
  ProductDetails,
};
