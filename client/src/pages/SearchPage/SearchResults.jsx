import React, { useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdZoomOutMap } from "react-icons/md";
import { ProductQuickViewModel } from "../../components/";
import useReduxHooks from "../../hooks/useReduxHooks";
import toast from "react-hot-toast";

const SearchResults = () => {
  const location = useLocation();
  const { cartActions, dispatch, wishlistActions, auth } = useReduxHooks();

  const results = location.state?.results || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isUserLoggedIn = auth?.status || false;

  const handleOpenModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      if (!isUserLoggedIn) {
        toast.error("Please login to add items to cart");
        return;
      }
      dispatch(cartActions.addToCart(product));
    },
    [dispatch, cartActions]
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Search Results</h2>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {results.map((product) => {
            const imageUrl = product.images?.[0]?.url || "/default-image.jpg";
            return (
              <div
                key={product._id}
                className="rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)] shadow-lg"
              >
                <div className="w-full overflow-hidden h-64 rounded-md relative group cursor-pointer">
                  <Link to={`/product/${product._id}`}>
                    <img
                      className="object-cover w-full h-full"
                      src={imageUrl}
                      alt={product.name || "Product Image"}
                    />
                  </Link>
                  {product.discount && (
                    <span className="absolute top-2 left-2 z-50 bg-primary text-white rounded-md p-2 text-sm font-medium">
                      {product.discount}% OFF
                    </span>
                  )}
                  <div className="actions absolute -top-52 group-hover:top-4 right-1 z-50 flex items-center gap-1 flex-col w-12 transition-all ease-in-out duration-300">
                    <Tooltip title="Add to Wishlist" arrow placement="left">
                      <Button
                        className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
                        onClick={() => {
                          if (!isUserLoggedIn) {
                            showError("Please login to add items to wishlist");
                            return;
                          }
                          dispatch(wishlistActions?.addTowishlist(product));
                        }
                        }
                      >
                        <FaRegHeart className="text-lg" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Add to Cart" arrow placement="left">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
                      >
                        <MdOutlineShoppingCart className="text-lg" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Quick View" arrow placement="left">
                      <Button
                        className="!w-9 !h-9 !min-w-9 !rounded-full !text-black !bg-white hover:!bg-primary hover:!text-white"
                        onClick={() => handleOpenModal(product)}
                      >
                        <MdZoomOutMap className="text-lg" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <div className="p-3 bg-[#f1f1f1]">
                  <h4 className="text-sm font-normal">
                    <Link
                      className="link transition-all"
                      to={`/product/${product._id}`}
                    >
                      {product.name?.substring(0, 30)}...
                    </Link>
                  </h4>
                  <h3 className="text-base mb-1 font-medium mt-1">
                    <Link
                      className="link transition-all"
                      to={`/product/${product._id}`}
                    >
                      {product.description?.substring(0, 50)}...
                    </Link>
                  </h3>
                  <Rating
                    name="half-rating-read"
                    defaultValue={product.rating || 0}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                  <div className="flex items-center gap-4">
                    {product.oldPrice && (
                      <span className="line-through text-gray-500">
                        {product.oldPrice} <span className="">PKR</span>
                      </span>
                    )}
                    <span className="text-[#3238f2] font-medium ml-2">
                      {product.price}{" "}
                      <span className="text-[#3238f2]">PKR</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No products found.</p>
      )}
      {selectedProduct && (
        <ProductQuickViewModel
          product={selectedProduct}
          openModel={isModalOpen}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SearchResults;
