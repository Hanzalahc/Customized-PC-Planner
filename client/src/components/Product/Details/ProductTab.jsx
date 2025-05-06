import React, { memo, useEffect, useState } from "react";
import parse from "html-react-parser";
import { Button } from "@mui/material";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import useReduxHooks from "../../../hooks/useReduxHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useProvideHooks from "../../../hooks/useProvideHooks";

const ProductTab = ({ product, onReviewAdded, reviewsRef }) => {
  const { auth } = useReduxHooks();
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [activeTab, setActiveTab] = useState(null);
  const [reviewValue, setReviewValue] = useState(0);
  const [hasUserPurchaseThisProduct, setHasUserPurchaseThisProduct] =
    useState(false);
  const noOfReviews = product?.reviews?.length || 0;
  const reviewsData = product?.reviews || [];
  const isUserLoggedIn = auth?.status || false;

  const defaultImg =
    "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg";

  const handleReviewAdd = async (data) => {
    if (reviewValue === 0) {
      showError("Please select a rating");
      return;
    }

    const formattedData = {
      review: data.review.trim().replace(/\s+/g, " "),
      rating: reviewValue,
    };

    const response = await apiSubmit({
      url: `${apis().addReview.url}${product?._id}`,
      method: apis().addReview.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Adding review...",
    });

    if (response.success) {
      setActiveTab(2);
      reset();
      setReviewValue(0);
      onReviewAdded();
    }
  };

  const checkUserProductPurchaseStatus = () => {
    const userOrderList = auth?.userData?.orderHistory || [];
    const productId = product?._id?.toString();

    const productFound = userOrderList.some((order) =>
      order?.products?.some(
        (p) =>
          p?.productId?._id?.toString() === productId &&
          order?.orderStatus === "delivered"
      )
    );

    setHasUserPurchaseThisProduct(productFound);
  };

  useEffect(() => {
    checkUserProductPurchaseStatus();
  }, [product?._id]);

  return (
    <div className="w-[95%] mx-auto mt-8 mb-5 rounded-lg bg-[#ccc]">
      <div
        className={`flex items-center gap-8 pt-12 pl-7 ${
          activeTab === null ? "pb-12" : ""
        }`}
      >
        <Button
          variant="contained"
          className={`${
            activeTab === 0
              ? "!bg-primary !text-white"
              : "!bg-gray-200 !text-black"
          } rounded-full`}
          onClick={() => setActiveTab(0)}
        >
          Description
        </Button>

        <Button
          variant="contained"
          ref={reviewsRef}
          className={`${
            activeTab === 2
              ? "!bg-primary !text-white"
              : "!bg-gray-200 !text-black"
          } rounded-full`}
          onClick={() => setActiveTab(2)}
        >
          Reviews ({noOfReviews})
        </Button>
      </div>
      {activeTab === 0 && (
        <div className="shadow-md w-full py-5 px-8 rounded-md">
          <h4 className="font-medium text-lg">Product Description</h4>
          <p className="mt-5 text-[#1E2024]">
            {parse(product?.content) || "No description available"}
          </p>
        </div>
      )}

      {activeTab === 2 && (
        <div className="laptop:shadow-md shadow-none w-full tablet:w-[80%] laptop:py-5 py-0 laptop:px-8 px-0 rounded-md">
          <div className="w-full">
            {reviewsData?.length === 0 ? (
              <h4 className="laptop:text-lg text-sm font-medium">
                There are no reviews for this product. Be the first to write a
                review
              </h4>
            ) : (
              <div className="scroll w-[80%] max-h-80 overflow-y-scroll overflow-x-hidden mt-5 pr-5">
                {reviewsData?.map((review, index) => (
                  <div
                    key={review?._id || index}
                    className="review w-full flex items-center justify-between pt-5 border-b border-[rgba(0,0,0,0.1)]"
                  >
                    <div className="info w-[60%] flex items-center gap-3">
                      <div className="img w-20 h-20 overflow-hidden rounded-full">
                        <img
                          src={review?.user?.avatar?.url || defaultImg}
                          alt={review?.user?.name}
                          className="w-full"
                        />
                      </div>
                      <div className="w-[80%]">
                        <h4 className="font-semibold">{review?.user?.name}</h4>
                        <h4 className="text-xs mb-0">
                          {review?.createdAt?.split("T")[0]}
                        </h4>
                        <p className="mt-0 text-sm">{review?.review}</p>
                      </div>
                    </div>
                    <Rating name="read-only" value={review?.rating} readOnly />
                  </div>
                ))}
              </div>
            )}

            <div className="reviewform bg-[#f1f1f1] p-4 rounded-md mt-8">
              <h4 className="text-lg font-medium">Add a review</h4>
              {isUserLoggedIn ? (
                <form
                  className="w-full mt-5 gap-3"
                  onSubmit={handleSubmit(handleReviewAdd)}
                >
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Write your review"
                    multiline
                    className="w-full mb-5"
                    rows={5}
                    {...register("review", {
                      required: "Review is required",
                      minLength: {
                        value: 10,
                        message: "Review must be at least 10 characters long",
                      },
                      maxLength: {
                        value: 1000,
                        message: "Review cannot be longer than 1000 characters",
                      },
                    })}
                  />
                  {errors.review && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.review.message}
                    </p>
                  )}
                  <Rating
                    className="mt-5"
                    name="simple-controlled"
                    value={reviewValue}
                    onChange={(event, newValue) => setReviewValue(newValue)}
                  />

                  <div className="flex items-center mt-5">
                    <Button
                      type="submit"
                      disabled={loading || !hasUserPurchaseThisProduct}
                      className="!bg-primary !text-white hover:!bg-black"
                    >
                      {loading ? (
                        "Loading..."
                      ) : hasUserPurchaseThisProduct ? (
                        "Submit"
                      ) : (
                        <span className="text-white text-sm ml-2">
                          You must purchase this product to review it
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-gray-500">
                  You must be logged in to post a review.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProductTab);
