import { memo, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container, ProductSliderItem } from "../../components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "./../../hooks/useReduxHooks";

const PopularTabs = () => {
  const { apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  // const { products, productActions, dispatch } = useReduxHooks();

  const [productsData, setProductsData] = useState([]);
  // const categoriesData = categories.categoriesData || [];
  // const productsData = products?.popularProductsData || [];
  const popularProducts = productsData?.filter((product) => product.rating > 4);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  // const fetchProducts = async () => {
  //   const response = await apiSubmit({
  //     url: `${apis().getAllProducts.url}`,
  //     method: apis().getAllProducts.method,

  //     showLoadingToast: true,
  //     successMessage: null,
  //   });

  //   if (response.success) {
  //     dispatch(productActions.setProducts(response.data));
  //     dispatch(productActions.setPopularProducts(response.data));
  //   }
  // };

  const handleCategoryFilter = async (id) => {
    //   if (id == "") {
    //     fetchProducts();
    //     return;
    //   }
    //   const response = await apiSubmit({
    //     url: `${apis().getProductsByCategory.url}${id}`,
    //     method: apis().getProductsByCategory.method,
    //     showLoadingToast: true,
    //     successMessage: null,
    //   });
    //   if (response.success) {
    //     dispatch(productActions.setPopularProducts(response.data));
    //   }
  };

  // Initial Fetch
  useEffect(() => {
    // fetchProducts();
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container className="section">
      {/* wrapper */}
      <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 my-[3rem]">
        <div className="flex items-center justify-between flex-col laptop:flex-row">
          <div className="leftside w-full laptop:w-[40%]">
            <h2 className=" h1 ">
              <span className="cucss">Popular</span> Pre-Build PCs
            </h2>
            <p
              className=" p  mt-0 mb-0 
            "
            >
              Products with 4+ rating available in the store
            </p>
          </div>
          <div className="rightside laptop:w-[60%] w-full ">
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {["Gaming", "Productivity", "Featured"].map((item, index) => (
                <Tab
                  key={item}
                  label={item}
                  onClick={() => handleCategoryFilter()}
                />
              ))}
            </Tabs>
          </div>
        </div>
        <div className="productslider py-5">
          <Swiper
            slidesPerView={5}
            spaceBetween={10}
            navigation={isDesktop}
            modules={[Navigation, FreeMode]}
            freeMode={true}
            breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              550: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              900: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1100: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
            className="mySwiper"
          >
            {popularProducts?.length > 0 ? (
              popularProducts?.map((product) => (
                <SwiperSlide key={product?._id}>
                  <ProductSliderItem product={product} />
                </SwiperSlide>
              ))
            ) : (
              <div className="text-center text-gray-600">
                <span className="laptop:text-xl text-sm">
                  No Popular Products Found for this category
                </span>
              </div>
            )}
          </Swiper>
        </div>
      </div>
    </Container>
  );
};

export default PopularTabs;
