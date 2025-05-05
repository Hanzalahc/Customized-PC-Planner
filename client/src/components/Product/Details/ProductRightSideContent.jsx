import React, { memo, useCallback, useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { Button, Tooltip } from "@mui/material";
import Select from "react-select";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import useReduxHooks from "../../../hooks/useReduxHooks";
import useProvideHooks from "../../../hooks/useProvideHooks";

const ProductRightSideContent = ({ product, goToReviews }) => {
  const { cartActions, dispatch, wishlistActions, auth } = useReduxHooks();
  const { showError } = useProvideHooks();

  const noOfReviews = product?.reviews?.length || 0;
  const isUserLoggedIn = auth?.status || false;
  const [selectedQty, setSelectedQty] = useState(1);
  const productType = product?.productType || "Cpu";
  const [selectedUpgrades, setSelectedUpgrades] = useState({});

  const handleUpgradeChange = (component, value) => {
    setSelectedUpgrades((prev) => ({
      ...prev,
      [component]: value,
    }));
  };

  const tooltips = {
    Cpu: "This is a processor that powers your system.",
    Ram: "Memory used for fast data access.",
    Prebuild: "A pre-assembled computer system.",
    Gpu: "Graphics card for rendering images and videos.",
    Cooler: "Used to keep the CPU or GPU cool.",
    Psu: "Power Supply Unit that provides electricity to components.",
    Storage: "HDDs or SSDs or Nvmes for storing data.",
    Case: "The enclosure that houses all components.",
    Motherboard: "The main circuit board connecting all components.",
  };

  const handleAddToCart = () => {
    if (!isUserLoggedIn) {
      showError("Please login to add items to cart");
      return;
    }
    const payload = {
      ...product,
    };

    dispatch(cartActions?.addToCart(payload));
  };

  const handleQtyClose = (qty, itemId, stock) => {
    if (!isUserLoggedIn) {
      showError("Please login to add items to cart");
      return;
    }

    if (qty > stock) {
      showError("Quantity is greater than the remaning stock");
      return;
    }

    setSelectedQty(qty);
    dispatch(cartActions.updateQuantity({ id: itemId, quantity: qty }));
  };

  return (
    <>
      <h1 className="mb-2 h1 ">{product?.name || "No Product Name"}</h1>
      <div className="flex tablet:items-center items-start flex-col tablet:flex-row gap-3 justify-start ">
        <span className="text-[#666] text-sm">
          Brand:{" "}
          <span className="text-black font-medium">
            {product?.brand || "No Product Brand"}
          </span>
        </span>
        <Rating
          name="read-only"
          value={product?.rating || 0}
          readOnly
          precision={0.1}
          size="small"
        />
        <span
          className="text-sm cursor-pointer text-[#666] "
          onClick={goToReviews}
        >
          Review ({noOfReviews})
        </span>
      </div>
      <div className="mt-4 space-y-4">
        {/* Pricing Section */}
        <div className="flex flex-col tablet:flex-row items-start tablet:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="line-through text-gray-500 text-lg">
              {product?.oldPrice} <span>PKR</span>
            </span>
            <span className="text-[#3238f2] font-semibold text-xl">
              {product?.price} <span className="text-[#3238f2]">PKR</span>
            </span>
          </div>
          <div className="text-gray-600 text-sm">
            Available in stock:{" "}
            <span className="text-green-600 font-semibold">
              {product?.stock} Items
            </span>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <span>
            Product Type:{" "}
            <Tooltip
              title={tooltips[productType] || "Unknown product type"}
              placement="top"
              arrow
            >
              <span className="text-gray-800 font-medium cursor-pointer hover:text-[#3238f2] transition">
                {productType}
              </span>
            </Tooltip>
          </span>
          <span>
            Items Sold:{" "}
            <span className="text-gray-800 font-medium">
              {product?.sale || 0}
            </span>
          </span>
          <span>
            Warranty:{" "}
            <span className="text-gray-800 font-medium">
              {product?.warranty || "No Warranty"}
            </span>
          </span>
        </div>

        {/* CPU-Specific Details */}
        {productType === "Cpu" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Core Count:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.coreCount || 0}
                </span>
              </span>
              <span>
                Thread Count:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.threadCount || 0}
                </span>
              </span>
              <span>
                Socket Supported:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.socket || "N/A"}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Stock Cooler Included:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.stockCooler ? "Yes" : "No"}
                </span>
              </span>
              <span>
                Benchmarks:{" "}
                <Tooltip
                  title={
                    product?.benchmark
                      ? `${product?.benchmark} Score`
                      : "No Benchmark Data"
                  }
                  placement="top"
                  arrow
                >
                  <span className="text-gray-800 font-medium cursor-pointer hover:text-[#3238f2] transition">
                    View Score
                  </span>
                </Tooltip>
              </span>
            </div>
          </div>
        )}
        {/* GPU-Specific Details */}
        {productType === "Gpu" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                VRAM:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.vRam || 0} GB
                </span>
              </span>
              <span>
                Memory Type:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.memoryType || "N/A"}
                </span>
              </span>
              <span>
                Interface Type:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.interfaceType || "N/A"}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                HDMI Ports:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.hdmiPorts || 0}
                </span>
              </span>
              <span>
                Display Ports:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.displayPorts || 0}
                </span>
              </span>
              <span>
                Memory Interface:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.memoryInterface || 0} Bit
                </span>
              </span>
            </div>
          </div>
        )}

        {/* RAM-Specific Details */}
        {productType === "Ram" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Memory Size:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.ramSize || 0} GB
                </span>
              </span>
              <span>
                Memory Type:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.ramType || "N/A"}
                </span>
              </span>
              <span>
                Latency:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.latency || 0} mhz
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Module:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.module || "N/A"}
                </span>
              </span>
              <span>
                Cache Latency:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.cacheLatency || 0} ms
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Storage-Specific Details */}
        {productType === "Storage" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Storage Type:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.storageType || "N/A"}
                </span>
              </span>
              <span>
                Capacity:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.capacity || 0} GB
                </span>
              </span>
              <span>
                Read Speed:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.readSpeed || 0} MB/s
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Write Speed:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.writeSpeed || 0} MB/s
                </span>
              </span>
            </div>
          </div>
        )}

        {/* PSU-Specific Details */}
        {productType === "Psu" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Power Supply Type
                <span className="text-gray-800 font-medium">
                  {product?.powerSupplyType || "powerSupplyType"}
                </span>
              </span>
              <span>
                Efficiency Rating:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.efficiencyRating || "N/A"}
                </span>
              </span>
              <span>
                Modular Type:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.modularType || "N/A"}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Cooler-Specific Details */}
        {productType === "Cooler" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Cooler Type:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.isWaterCooled ? "Water" : "Air" || "N/A"}
                </span>
              </span>
              <span>
                Socket Supported:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.socket || "N/A"}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Case-Specific Details */}
        {productType === "Case" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Side Panel:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.sidePanel || "N/A"}
                </span>
              </span>
              <span>
                Front Panel:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.frontPanel || "N/A"}
                </span>
              </span>
              <span>
                Form Factor:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.formFactor || "N/A"}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Motherboard-Specific Details */}
        {productType === "Motherboard" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span>
                Socket:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.socket || "N/A"}
                </span>
              </span>
              <span>
                Form Factor:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.formFactor || "N/A"}
                </span>
              </span>
              <span>
                Memory Type:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.memoryType || "N/A"}
                </span>
              </span>
              <span>
                No of Memory Slots:{" "}
                <span className="text-gray-800 font-medium">
                  {product?.memorySlots || "N/A"}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Pre build one */}
        {productType === "Prebuild" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Prebuilt PC Specifications
            </h2>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Component</th>
                    <th className="p-2 border">Model</th>
                    <th className="p-2 border">Price (PKR)</th>
                    <th className="p-2 border">Upgradeable</th>
                  </tr>
                </thead>
                <tbody>
                  {product?.components?.map((component, index) => (
                    <tr key={index} className="border">
                      <td className="p-2 border">{component.type}</td>
                      <td className="p-2 border">{component.model || "N/A"}</td>
                      <td className="p-2 border">
                        {component.price ? `${component.price} PKR` : "N/A"}
                      </td>
                      <td className="p-2 border">
                        {component.upgrades && component.upgrades.length > 0
                          ? "Yes"
                          : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Upgrade Options */}
            {product?.components?.some(
              (c) => c.upgrades && c.upgrades.length > 0
            ) && (
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700">
                  Upgrade Options
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">Component</th>
                        <th className="p-2 border">Upgrade Option</th>
                        <th className="p-2 border">Additional Cost (PKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product?.components?.map((component, index) =>
                        component.upgrades?.map((upgrade, uIndex) => (
                          <tr key={`${index}-${uIndex}`} className="border">
                            <td className="p-2 border">{component.type}</td>
                            <td className="p-2 border">{upgrade.model}</td>
                            <td className="p-2 border">
                              {upgrade.price ? `${upgrade.price} PKR` : "N/A"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm mt-3 pr-10 mb-5">
          {product?.description || "No Product Description"}
        </p>
      </div>

      <p className="text-sm mt-4 mb-2">Free Shipping (Est. 7-10 days)</p>
      <div className="flex items-center gap-4">
        <div className="qtyboxwrapper w-[4.4rem]">
          <Select
            className="text-sm tablet:text-base font-medium"
            classNamePrefix="select"
            isSearchable={true}
            defaultValue={{
              value: product.quantity || selectedQty,
              label: product.quantity || selectedQty,
            }}
            name="color"
            options={
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((qty) => ({
                value: qty,
                label: qty,
              })) || []
            }
            placeholder="Select Quantity"
            onChange={(e) => {
              handleQtyClose(e.value, product?._id, product?.stock);
            }}
          />
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={product?.stock === 0}
          className=" !bg-primary hover:!bg-black flex gap-2 !text-white"
        >
          <MdOutlineShoppingCart className=" text-xl text-white" />
          {product?.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <span
          onClick={() => {
            if (!isUserLoggedIn) {
              showError("Please login to add items to wishlist");
              return;
            }
            dispatch(wishlistActions?.addTowishlist(product));
          }}
          className="flex items-center gap-3 tablet:text-sm text-xs mt-2 link cursor-pointer font-medium"
        >
          <FaRegHeart />
          Add to Wishlist
        </span>
      </div>
    </>
  );
};

export default memo(ProductRightSideContent);
