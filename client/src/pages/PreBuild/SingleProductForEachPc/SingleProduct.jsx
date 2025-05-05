import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../../components/Container/Container";
import Cart from "../../../components/Cart";
import BuyButton from "../../../components/BuyButton";

function SingleProduct() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };
  return (
    <main>
      <Container className=" bg-white md:py-16 dark:bg-gray-900 antialiased ">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            {/* Product Image */}
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto animate__animated wow animate__fadeInLeft">
              <img
                className="w-full dark:block rounded-lg shadow-lg"
                src="http://localhost:5173/assets/hero%20section.webp"
                alt="Product Image"
              />
            </div>

            {/* Product Information */}
            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Built 1: Ryzen 5600 CPU with Rx 6700xt 12GB GDDR6 GPU
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                  180,000 PKR
                </p>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-5 h-5 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    (5.0)
                  </p>
                  <Link
                    to="#"
                    className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    345 Reviews
                  </Link>
                </div>
              </div>

              {/* Specifications Section */}
              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <p className="p text-gray-700 dark:text-gray-300">
                Featuring the Ryzen 5600 CPU and RX 6700 XT 12GB GDDR6 GPU, this
                build is perfect for gaming, performance, and multitasking.
              </p>

              <div className="item-box animate__animated wow animate__fadeInRight">
                {[
                  { label: "CPU", value: "Ryzen 5600" },
                  { label: "CPU Cooler", value: "Dark Flash Cooler" },
                  { label: "Motherboard", value: "B450" },
                  { label: "RAM", value: "16GB DDR4 3200MH" },
                  { label: "Storage", value: "256GB NVME & 1TB" },
                  { label: "GPU", value: "Rx 6700xt 12GB GDDR6" },
                  { label: "Gaming Case", value: "Thunder 3 Fans RGB" },
                  { label: "Power Supply", value: "Boost 650W 80+ Bronze" },
                ].map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b py-2"
                  >
                    <span className="text-gray-900 dark:text-white">
                      {spec.label}
                    </span>
                    <span className="ml-auto text-gray-900 dark:text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upgrade Options */}
          <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-xl dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Upgrade Options
            </h2>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 dark:text-gray-300">
                  32GB DDR5 RAM (+₨18,000)
                </span>
                <input
                  type="checkbox"
                  className="w-6 h-6 text-primary bg-gray-200 rounded focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
                />
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 dark:text-gray-300">
                  RX 6700XT GPU (+₨21,000.00)
                </span>
                <input
                  type="checkbox"
                  className="w-6 h-6 text-primary bg-gray-200 rounded focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
                />
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 dark:text-gray-300">
                  1TB NVME (+₨12,500.00)
                </span>
                <input
                  type="checkbox"
                  className="w-6 h-6 text-primary bg-gray-200 rounded focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
                />
              </div>
              {/* Totals Section */}
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 shadow-inner">
                <div className="flex justify-between items-center text-lg font-bold text-gray-800 dark:text-gray-100">
                  <span>Product Total</span>
                  <span>₨345,000</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-800 dark:text-gray-100">
                  <span>Options Total</span>
                  <span>₨0</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-extrabold text-gray-800 dark:text-gray-100 mt-4">
                  <span>Grand Total</span>
                  <span>₨345,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buy & Cart Buttons */}
          <div className="mt-6 flex-col sm:flex-row flex sm:items-center sm:gap-4">
            <BuyButton desc="Buy Now" src="/checkout"></BuyButton>

            <Cart cart=""></Cart>
          </div>
          {/* Tabs Section */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {["Description", "Additional Information", "Reviews"].map(
                  (tab, index) => (
                    <button
                      key={index}
                      className="text-gray-900 dark:text-white py-4 px-1 border-b-2 font-medium text-sm border-transparent hover:border-primary-500 focus:outline-none transition duration-200 ease-in-out"
                      role="tab"
                      aria-selected={index === 0} // Change this based on active tab state
                      onClick={() => handleTabChange(index)} // Function to handle tab change
                    >
                      {tab}
                    </button>
                  )
                )}
              </nav>
            </div>

            <div className="mt-6">
              {/* Tab Content */}
              <div>
                {/* Content for Description */}
                {activeTab === 0 && ( // Use state variable to control visibility
                  <div className="text-gray-700 dark:text-gray-300">
                    <h3 className="text-lg font-semibold">
                      Product Description
                    </h3>
                    <p>
                      Buy Ryzen 5 7500F with RTX 4070 Super 12GB in Pakistan.
                      Keep your gaming experience running smoothly with this
                      latest budget build. This is a complete Ryzen 5 7500F
                      paired with RTX 4070 Super 12GB Build for those who want
                      the latest specs without breaking the bank.
                    </p>
                    <h1 className="text-lg font-semibold">Full Specs:</h1>
                    <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                      <li>Processor: Ryzen 5 7500F</li>
                      <li>Cooler: ID Cooling SE 214 XT</li>
                      <li>Motherboard: Maxsun B650M</li>
                      <li>RAM: 16GB 5200MHz DDR5</li>
                      <li>Storage: 256GB NVMe</li>
                      <li>Additional Storage: 1TB HDD</li>
                      <li>Casing: Thunder Triumph Case / Black Fox Case</li>
                      <li>Power Supply: 750W PSU</li>
                      <li>Graphics Card: RTX 4070 Super</li>
                    </ul>
                    <p className="mt-4">
                      Warranty: 1-Year Local (New Parts), 2-Weeks (Used Parts)
                    </p>
                  </div>
                )}

                {/* Content for Additional Information */}
                {activeTab === 1 && ( // Use state variable to control visibility
                  <div className="text-gray-700 dark:text-gray-300 mt-6">
                    <h3 className="text-lg font-semibold">
                      Additional Information
                    </h3>
                    <table className="mt-4 w-full border-collapse">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium text-gray-800 dark:text-gray-200">
                            Weight
                          </td>
                          <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                            8 kg
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium text-gray-800 dark:text-gray-200">
                            Warranty
                          </td>
                          <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                            1-Year for New Products, 2-Weeks for Used Products
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Content for Reviews */}
                {activeTab === 2 && ( // Use state variable to control visibility
                  <div className="text-gray-700 dark:text-gray-300 mt-6">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <form className="mt-4">
                      <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
                        rows="4"
                        placeholder="Write a review..."
                      ></textarea>
                      <button className="mt-2 bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-200 ease-in-out">
                        Submit Review
                      </button>
                    </form>
                    <div className="mt-6">
                      <p>No reviews yet. Be the first to write one!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default SingleProduct;
