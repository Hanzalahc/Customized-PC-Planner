import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../../components/Container/Container";
import Cart from "../../../components/Cart";
import BuyButton from "../../../components/BuyButton";

function SingleProductComponents() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };
  return (
    <main>
      <Container className={"text-gray-600 body-font overflow-hidden"}>
        {/* wrapper */}
        <div className="container px-5 py-24 mx-auto">
          {/* Sub Wrapper */}
          <div className="lg:w-4/5 mx-auto flex flex-wrap bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full h-auto object-cover object-center rounded-t-lg"
              src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.1600.jpg"
            />

            {/* Right Side Wrapper */}
            <div className="lg:w-1/2 w-full lg:p-10 p-6">
              <h1 className="text-gray-900 text-3xl font-semibold mb-2">
                AMD Ryzen 5 3600 3.6 GHz 6-Core Processor
              </h1>
              {/* Icon Wrapper */}
              <div className="flex mb-4">
                {/* Star Icons */}
                <span className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      fill={index < 4 ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5 text-yellow-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  ))}
                  <span className="text-gray-600 ml-3">4 Reviews</span>
                </span>
              </div>
              <p className="leading-relaxed text-gray-700 mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam veniam mollitia illo reprehenderit, atque impedit.
              </p>
              <div className="space-y-1 text-gray-600">
                <p>
                  <b>Brand:</b> AMD
                </p>
                <p>
                  <b>CPU Manufacturer:</b> AMD
                </p>
                <p>
                  <b>CPU Model:</b> Ryzen 5 3600
                </p>
                <p>
                  <b>CPU Cores:</b> 6 Cores 5 Threads
                </p>
                <p>
                  <b>CPU Speed:</b> 4.2 GHz
                </p>
                <p>
                  <b>CPU Socket:</b> AM4
                </p>
              </div>

              {/* Price & Button Wrapper */}
              <div className="flex items-center justify-between mt-6">
                <span className="font-medium sm:text-2xl text-lg text-gray-900">
                  25,000 PKR
                </span>
                <div className="flex space-x-4">
                  <BuyButton desc="Buy Now" src="/checkout" />
                  <Cart cart="" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {["Description", "Additional Information", "Reviews"].map(
                  (tab, index) => (
                    <button
                      key={index}
                      className="text-gray-800 py-4 px-1 border-b-2 font-medium text-sm border-transparent hover:border-primary-500 focus:outline-none transition duration-200 ease-in-out"
                      role="tab"
                      aria-selected={activeTab === index} // Change this based on active tab state
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
                  <div className="text-gray-800">
                    {" "}
                    {/* Updated text color */}
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
                    <ul className="list-disc pl-5 mt-2 text-gray-800">
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
                  <div className="text-gray-800 mt-6">
                    {" "}
                    {/* Updated text color */}
                    <h3 className="text-lg font-semibold">
                      Additional Information
                    </h3>
                    <table className="mt-4 w-full border-collapse">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium text-gray-800">
                            Weight
                          </td>
                          <td className="py-2 text-right text-gray-600">
                            8 kg
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium text-gray-800">
                            Warranty
                          </td>
                          <td className="py-2 text-right text-gray-600">
                            1-Year for New Products, 2-Weeks for Used Products
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Content for Reviews */}
                {activeTab === 2 && ( // Use state variable to control visibility
                  <div className="text-gray-800 mt-6">
                    {" "}
                    {/* Updated text color */}
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

export default SingleProductComponents;
