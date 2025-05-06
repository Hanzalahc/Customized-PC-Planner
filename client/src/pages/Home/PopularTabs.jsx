import { memo, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container, ProductSliderItem } from "../../components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";

const PopularTabs = ({ products }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const [popularProducts, setPopularProducts] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleCategoryFilter = (item, index) => {
    setTabIndex(index);
    setPopularProducts(
      products?.filter(
        (product) => product.category.name === item && product.rating >= 4
      )
    );
  };

  // Initial Fetch
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };
  
    window.addEventListener("resize", handleResize);
  
    if (products && products.length > 0) {
      handleCategoryFilter("Gaming", 0);
    }
  
    return () => window.removeEventListener("resize", handleResize);
  }, [products]); 
  

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
              Pre Build Pc with 4 or above rating
            </p>
          </div>
          <div className="rightside laptop:w-[60%] w-full ">
            <Tabs
              value={tabIndex}
              onChange={(e, newValue) => {
                const selectedCategory = ["Gaming", "Productivity"][newValue];
                handleCategoryFilter(selectedCategory, newValue);
              }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {["Gaming", "Productivity"].map((item) => (
                <Tab key={item} label={item} />
              ))}
            </Tabs>
          </div>
        </div>
        <div className="productslider py-5">
          <Swiper
            slidesPerView={4}
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
                slidesPerView: 4,
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
