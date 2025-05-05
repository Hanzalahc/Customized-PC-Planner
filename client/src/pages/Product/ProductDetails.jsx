import React, { memo, useState, useEffect, useRef } from "react";
import {
  ProductRightSideContent,
  ProductZoom,
  ProductTab,
} from "../../components";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

const ProductDetails = () => {
  const { apis, useParams } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { productId } = useParams();

  const [productData, setProductData] = useState({});
  const reviewsRef = useRef(null);

  const fetchProductData = async () => {
    const response = await apiSubmit({
      url: `${apis().getSingleProduct.url}${productId}`,
      method: apis().getSingleProduct.method,
      showLoadingToast: true,
      successMessage: null,
    });

    if (response?.success) {
      setProductData(response?.data);
    }
  };

  const goToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Initial Fetch
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [productId]);

  return (
    <>
      <section className="bg-white py-5">
        <div className="w-[95%] mx-auto flex gap-8 flex-col laptop:flex-row items-start laptop:items-center">
          <div className="zoom-leftside laptop:w-[40%] w-full ">
            <ProductZoom product={productData} />
          </div>
          <div className="rightsidecontent w-full laptop:w-[60%] pr-10 pl-10 ">
            <ProductRightSideContent
              product={productData}
              goToReviews={goToReviews}
            />
          </div>
        </div>

        {/* Product Tab */}
        <ProductTab
          product={productData}
          onReviewAdded={fetchProductData}
          reviewsRef={reviewsRef}
        />
      </section>
    </>
  );
};

export default memo(ProductDetails);
