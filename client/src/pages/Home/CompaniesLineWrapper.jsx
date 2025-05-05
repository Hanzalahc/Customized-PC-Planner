import React, { useEffect, useRef } from "react";

function CompaniesLineWrapper() {
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);

  const initialTranslateLTR = -48 * 4;
  const initialTranslateRTL = 36 * 4;

  const scrollHandler = (element, isLTR, speed) => {
    const translateX =
      (window.innerHeight - element.getBoundingClientRect().top) * speed;

    let totalTranslate = 0;
    if (isLTR) {
      totalTranslate = translateX + initialTranslateLTR;
    } else {
      totalTranslate = -(translateX + initialTranslateRTL);
    }

    element.style.transform = `translateX(${totalTranslate}px)`;
  };

  const setupIntersectionObserver = (element, isLTR, speed) => {
    const intersectionCallback = (entries) => {
      const isIntersecting = entries[0].isIntersecting;
      if (isIntersecting) {
        document.addEventListener("scroll", () =>
          scrollHandler(element, isLTR, speed)
        );
      } else {
        document.removeEventListener("scroll", () =>
          scrollHandler(element, isLTR, speed)
        );
      }
    };

    const intersectionObserver = new IntersectionObserver(intersectionCallback);
    intersectionObserver.observe(element);

    return intersectionObserver; // Return the observer for cleanup
  };

  useEffect(() => {
    let observers = [];

    if (line1Ref.current) {
      observers.push(setupIntersectionObserver(line1Ref.current, true, 0.15));
    }
    if (line2Ref.current) {
      observers.push(setupIntersectionObserver(line2Ref.current, false, 0.15));
    }
    if (line3Ref.current) {
      observers.push(setupIntersectionObserver(line3Ref.current, true, 0.15));
    }

    // Cleanup on unmount
    return () => {
      observers.forEach((observer) => observer.disconnect());
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <div id="lines-group" className="flex flex-col gap-4 2xl:ml-[14%]">
      {/* each */}
      <div
        id="line1"
        ref={line1Ref}
        className="flex gap-4 w-screen -translate-x-48 transition-transform ease-linear"
      >
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">CPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/00979205bfe0f63cf50f396392775b9f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            CPU Cooler
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/17b2fe7f91dc3d74fd0b7503dc6dd8ad.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            MotherBoard
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/835ab3efad1be13bbe53beef3e3c6f96.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">RAM</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/3b2a91588d1a28bfa1b0184fb7f1c0a1.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            Storage
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/232dd1c4ff3c7494fae18e5e99c878ce.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">GPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/61eb5534e35ce8af07f25ff28197862b.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            Gaming Case
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/4c2a36634803871ec36077cba6cbac4f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            Power Supply
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">CPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/00979205bfe0f63cf50f396392775b9f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            CPU Cooler
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/17b2fe7f91dc3d74fd0b7503dc6dd8ad.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            MotherBoard
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/835ab3efad1be13bbe53beef3e3c6f96.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">RAM</span>
        </div>
      </div>
      {/* each */}
      <div
        id="line2"
        ref={line2Ref}
        className="flex gap-4 w-screen -translate-x-36 transition-transform ease-linear"
      >
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">CPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/00979205bfe0f63cf50f396392775b9f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            CPU Cooler
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/17b2fe7f91dc3d74fd0b7503dc6dd8ad.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            MotherBoard
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/835ab3efad1be13bbe53beef3e3c6f96.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">RAM</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/3b2a91588d1a28bfa1b0184fb7f1c0a1.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            Storage
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/232dd1c4ff3c7494fae18e5e99c878ce.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">GPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/61eb5534e35ce8af07f25ff28197862b.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            Gaming Case
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/4c2a36634803871ec36077cba6cbac4f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">PSU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">CPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/00979205bfe0f63cf50f396392775b9f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            CPU Cooler
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/17b2fe7f91dc3d74fd0b7503dc6dd8ad.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            MotherBoard
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/835ab3efad1be13bbe53beef3e3c6f96.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">RAM</span>
        </div>
      </div>
      {/* each */}
      {/* <div
        id="line3"
        ref={line3Ref}
        className="flex  gap-4 w-screen -translate-x-48 transition-transform ease-linear"
      >
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">CPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/00979205bfe0f63cf50f396392775b9f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            CPU Cooler
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/17b2fe7f91dc3d74fd0b7503dc6dd8ad.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            MotherBoard
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/835ab3efad1be13bbe53beef3e3c6f96.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">RAM</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/3b2a91588d1a28bfa1b0184fb7f1c0a1.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            Storage
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/232dd1c4ff3c7494fae18e5e99c878ce.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">GPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/61eb5534e35ce8af07f25ff28197862b.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            Gaming Case
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/4c2a36634803871ec36077cba6cbac4f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">PSU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">CPU</span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/00979205bfe0f63cf50f396392775b9f.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            CPU Cooler
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/17b2fe7f91dc3d74fd0b7503dc6dd8ad.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">
            MotherBoard
          </span>
        </div>
        <div className="flex flex-col justify-center gap-2 items-center min-w-24 min-h-24 bg-white rounded-xl border border-gray-300 md:min-h-32 md:min-w-32">
          <img
            src="https://cdna.pcpartpicker.com/static/forever/images/product/835ab3efad1be13bbe53beef3e3c6f96.256p.jpg"
            className="w-12 h-12 md:w-16 md:h-16"
            alt=""
          />
          <span className="text-[12px] font-semibold lg:text-[16px]">RAM</span>
        </div>
      </div> */}
    </div>
  );
}

export default CompaniesLineWrapper;
