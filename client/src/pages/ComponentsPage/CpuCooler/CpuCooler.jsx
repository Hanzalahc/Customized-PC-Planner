import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Pagination from "@mui/material/Pagination";
import Rating from "@mui/material/Rating";
import { Button, Checkbox } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useReduxHooks from "../../../hooks/useReduxHooks";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

function CpuCooler() {
  const { apis, Link, showError } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { dispatch, cartActions, wishlistActions, auth } = useReduxHooks();
  const [filters, setFilters] = useState({
    manufacturor: "",
    price: "",
    featured: "",
    socket: "",
    isWaterCooled: "",
    isFanless: "",
  });

  const [paginations, setPaginations] = useState({
    productCurrentPage: 1,
    productTotalPages: 1,
  });
  const [coolerData, setCoolerData] = useState([]);
  const isUserLoggedIn = auth?.status || false;

  const showAllCooler = async (page) => {
    const payload = {
      pageNum: page,
    };

    if (filters?.manufacturor) {
      payload.manufacturor = filters?.manufacturor;
    }

    if (filters?.price) {
      payload.price = filters?.price;
    }
    if (filters?.featured) {
      payload.featured = filters?.featured;
    }

    if (filters?.socket) {
      payload.socket = filters?.socket;
    }
    if (filters?.isWaterCooled) {
      payload.isWaterCooled = filters?.isWaterCooled;
    }
    if (filters?.isFanless) {
      payload.isFanless = filters?.isFanless;
    }

    const response = await apiSubmit({
      url: apis().getAllCooler.url,
      method: apis().getAllCooler.method,
      query: { data: payload },
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });

    if (response?.success) {
      setCoolerData(response?.data.coolers);
      setPaginations({
        productTotalPages: response?.data.totalPages,
        productCurrentPage: page,
      });
    } else {
      setCoolerData([]);
      setPaginations({
        productTotalPages: 1,
        productCurrentPage: 1,
      });
    }
  };

  const handleProductPageChange = (event, page) => {
    setPaginations((prev) => ({
      ...prev,
      productCurrentPage: page,
    }));
    showAllCooler(page);
  };

  const handleManufacturorFilter = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setFilters((prev) => ({
        ...prev,
        manufacturor: e.target.value,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        manufacturor: "",
      }));
    }
  };

  const handleFeaturedFilter = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setFilters((prev) => ({
        ...prev,
        featured: e.target.value,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        featured: "",
      }));
    }
  };
  const handleSocketFilter = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setFilters((prev) => ({
        ...prev,
        socket: e.target.value,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        socket: "",
      }));
    }
  };
  const handleisWaterCooledFilter = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setFilters((prev) => ({
        ...prev,
        isWaterCooled: e.target.value,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        isWaterCooled: "",
      }));
    }
  };

  const handleisFanlessFilter = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setFilters((prev) => ({
        ...prev,
        isFanless: e.target.value,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        isFanless: "",
      }));
    }
  };

  const handlePriceFilter = (e) => {
    setFilters((prev) => ({
      ...prev,
      price: e.target.value,
    }));
  };

  useEffect(() => {
    showAllCooler(paginations.productCurrentPage);
  }, [
    paginations.productCurrentPage,
    filters?.manufacturor,
    filters?.price,
    filters?.featured,
    filters?.socket,
    filters?.isWaterCooled,
    filters?.isFanless,
  ]);

  return (
    <main className="relative">
      <Container className={"w-full my-[3rem]"}>
        <div className="mx-auto max-w-7xl px-2 py-10 lg:px-10">
          <div className="md:flex md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="h1">Cooler Products</h1>
            </div>
          </div>
          <hr className="my-8" />
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <div className="space-y-6 divide-y lg:col-span-3 lg:block">
              {/* Left side filters */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manufacturer
                </h3>
                <ul className="mt-2 ">
                  {[
                    "ADATA",
                    "Aerocool",
                    "AMD",
                    "Deepcool",
                    "Darkflash",
                    "EVGA",
                    "Evercool",
                    "Gigabyte",
                    "Intel",
                    "Cooler Master",
                    "Lian Li",
                    "Razer",
                    "Sapphire",
                    "SilverX",
                    "Silverstone",
                    "Thermaltake",
                    "Ball",
                    "Fluid Dynamic",
                    "Rifle",
                    "Noctua",
                    "Sleeve",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between "
                    >
                      <div className="flex items-center">
                        <Checkbox
                          sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                          value={item}
                          onChange={handleManufacturorFilter}
                        />
                        <label
                          htmlFor="color-white"
                          className="ml-3 text-sm font-medium text-gray-900"
                        >
                          {item}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Socket</h3>
                <ul className="mt-2 ">
                  {[
                    "AM1",
                    "AM2",
                    "AM3",
                    "AM4",
                    "AM5",
                    "LGA 775",
                    "LGA 1150",
                    "LGA 1151",
                    "LGA 1155",
                    "LGA 1156",
                    "LGA 1200",
                    "LGA 1366",
                    "LGA 1700",
                    "LGA 1851",
                    "LGA 2011",
                    "LGA 2066",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between "
                    >
                      <div className="flex items-center">
                        <Checkbox
                          sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                          value={item}
                          onChange={handleSocketFilter}
                        />
                        <label
                          htmlFor="color-white"
                          className="ml-3 text-sm font-medium text-gray-900"
                        >
                          {item}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Featured
                </h3>
                <ul className="mt-2 ">
                  <li className="flex items-center justify-between ">
                    <div className="flex items-center">
                      <Checkbox
                        sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                        value={true}
                        onChange={handleFeaturedFilter}
                      />
                      <label
                        htmlFor="color-white"
                        className="ml-3 text-sm font-medium text-gray-900"
                      >
                        Yes
                      </label>
                    </div>
                  </li>
                  <li className="flex items-center justify-between ">
                    <div className="flex items-center">
                      <Checkbox
                        sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                        value={"no"}
                        onChange={handleFeaturedFilter}
                      />
                      <label
                        htmlFor="color-gray"
                        className="ml-3 text-sm font-medium text-gray-900"
                      >
                        No
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  is Water Cooled
                </h3>
                <ul className="mt-2 ">
                  <li className="flex items-center justify-between ">
                    <div className="flex items-center">
                      <Checkbox
                        sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                        value={"true"}
                        onChange={handleisWaterCooledFilter}
                      />
                      <label
                        htmlFor="color-white"
                        className="ml-3 text-sm font-medium text-gray-900"
                      >
                        Yes
                      </label>
                    </div>
                  </li>
                  <li className="flex items-center justify-between ">
                    <div className="flex items-center">
                      <Checkbox
                        sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                        value={"false"}
                        onChange={handleFeaturedFilter}
                      />
                      <label
                        htmlFor="color-gray"
                        className="ml-3 text-sm font-medium text-gray-900"
                      >
                        No
                      </label>
                    </div>
                  </li>
                </ul>
              </div>{" "}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  is Fanless
                </h3>
                <ul className="mt-2 ">
                  <li className="flex items-center justify-between ">
                    <div className="flex items-center">
                      <Checkbox
                        sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                        value={"true"}
                        onChange={handleFeaturedFilter}
                      />
                      <label
                        htmlFor="color-white"
                        className="ml-3 text-sm font-medium text-gray-900"
                      >
                        Yes
                      </label>
                    </div>
                  </li>
                  <li className="flex items-center justify-between ">
                    <div className="flex items-center">
                      <Checkbox
                        sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                        value={"false"}
                        onChange={handleisFanlessFilter}
                      />
                      <label
                        htmlFor="color-gray"
                        className="ml-3 text-sm font-medium text-gray-900"
                      >
                        No
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Price</h3>
                <ul className="mt-2 ">
                  <li className="flex items-center justify-between ">
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={filters.price}
                        onChange={handlePriceFilter}
                        name="price-filter"
                      >
                        <FormControlLabel
                          value="high"
                          control={
                            <Radio
                              sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                            />
                          }
                          label="High to Low"
                        />
                        <FormControlLabel
                          value="low"
                          control={
                            <Radio
                              sx={{ "&.Mui-checked": { color: "#3238f2" } }}
                            />
                          }
                          label="Low to High"
                        />
                      </RadioGroup>
                    </FormControl>
                  </li>
                </ul>
              </div>
            </div>
            {/* Right side products wrapper */}
            <div className="h-[400px] w-full rounded-lg px-2 lg:col-span-9 lg:h-full">
              {/* sub produc wrapper */}
              <div className="item-box grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coolerData && coolerData.length > 0 ? (
                  coolerData.map((product) => (
                    <div className="rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)] shadow-lg">
                      <div className="w-full overflow-hidden laptop:h-64 h-[10rem] rounded-md relative group cursor-pointer">
                        <Link to={`/product/${product._id}`}>
                          <img
                            className="object-cover w-full h-full"
                            src={product.images && product.images[0].url}
                            alt={product.name || "Product Image"}
                          />
                        </Link>
                        <span className="flex items-center absolute top-2 left-2 z-50 bg-primary text-white rounded-md p-2 laptop:text-sm text-xs font-medium">
                          -{product.discount}%
                        </span>
                        <div className="actions absolute -top-52 group-hover:top-4 right-1 z-50 flex items-center gap-1 flex-col w-12 transition-all ease-in-out duration-300">
                          <Tooltip
                            title="Add to Wishlist"
                            arrow
                            placement="left"
                          >
                            <Button
                              className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
                              onClick={() => {
                                if (!isUserLoggedIn) {
                                  showError(
                                    "Please login to add items to wishlist"
                                  );
                                  return;
                                }
                                dispatch(
                                  wishlistActions?.addTowishlist(product)
                                );
                              }}
                            >
                              <FaRegHeart className="text-lg" />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Add to Cart" arrow placement="left">
                            <Button
                              onClick={() => {
                                if (!isUserLoggedIn) {
                                  showError(
                                    "Please login to add items to cart"
                                  );
                                  return;
                                }
                                dispatch(cartActions.addToCart(product));
                              }}
                              className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
                            >
                              <MdOutlineShoppingCart className="text-lg" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="p-3 bg-[#f1f1f1]">
                        <h3 className="laptop:text-sm text-xs font-normal">
                          <Link
                            className="link transition-all"
                            to={`/product/${product._id}`}
                          >
                            {product.name && product.name.substring(0, 50)}...
                          </Link>
                        </h3>
                        <h4 className="laptop:text-base text-sm mb-1 font-medium mt-1">
                          <Link
                            className="link transition-all"
                            to={`/product/${product._id}`}
                          >
                            {product.description &&
                              product.description.substring(0, 60)}
                            ...
                          </Link>
                        </h4>
                        <Rating
                          name="half-rating-read"
                          defaultValue={product.rating || 0}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <div className="flex items-center laptop:gap-4 gap-1">
                          <span className="line-through text-gray-500 laptop:text-base text-sm">
                            {product.oldPrice} <span className="">Pkr</span>
                          </span>
                          <span className="text-primary font-medium ml-2 laptop:text-base text-sm">
                            {product.price}{" "}
                            <span className="text-primary">Pkr</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No Cooler to show</div>
                )}
              </div>
              <div className="productlistpagination w-full flex justify-center mt-10">
                <Pagination
                  count={paginations.productTotalPages}
                  page={paginations.productCurrentPage}
                  onChange={handleProductPageChange}
                  color="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default CpuCooler;
