import React, { memo, useState, useRef, useEffect } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const ProductZoom = ({ product }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const zoomSliderBig = useRef(null);
  const zoomSliderThumb = useRef(null);

  const goto = (index) => {
    setSlideIndex(index);
    if (zoomSliderBig.current?.slideTo) zoomSliderBig.current.slideTo(index);
    if (zoomSliderThumb.current?.slideTo)
      zoomSliderThumb.current.slideTo(index);
  };

  const images = product?.images?.map((image) => image?.url) || [];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex gap-3 flex-col laptop:flex-row">
      {/* Thumbnail Swiper */}
      <div className="swiperslider w-full laptop:w-[15%] order-2 laptop:order-1">
        <Swiper
          onSwiper={(swiper) => (zoomSliderThumb.current = swiper)}
          direction={isDesktop ? "vertical" : "horizontal"}
          slidesPerView={4}
          spaceBetween={10}
          navigation={isDesktop ? true : false}
          modules={[Navigation]}
          className="zoomVerticalSliderThumb h-auto  laptop:h-[31.25rem] overflow-hidden"
        >
          {images?.map((image, index) => (
            <SwiperSlide key={image}>
              <div
                className="rounded-md overflow-hidden cursor-pointer group"
                onClick={() => goto(index)}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full transition-all group-hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Swiper */}
      <div className="zoombox w-full laptop:w-[85%] h-[18.75rem] laptop:h-[31.25rem] overflow-hidden rounded-lg order-1 laptop:order-2">
        <Swiper
          onSwiper={(swiper) => (zoomSliderBig.current = swiper)}
          onSlideChange={(swiper) => setSlideIndex(swiper.activeIndex)}
          slidesPerView={1}
          spaceBetween={10}
          navigation={false}
          modules={[Navigation]}
          className=""
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <InnerImageZoom
                src={image}
                zoomSrc={image}
                className="w-full h-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default memo(ProductZoom);
