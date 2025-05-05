import React from "react";
import EachBuildPc from "./EachBuildPc";
import { Button, Container } from "../../components/index";

function EachSection({
  h2normal = "Pre-Built",
  h2span = "Gaming PCs",
  h3 = "Best value for money builds",
  p = "Get the perfect blend of performance and value with this build, tailored for gamers who want high-quality gameplay without breaking the bank.",
  showH2 = false,
  showH3 = true,
  showBtn = false,
  className = "",
  builds = [], // Receive the builds data as a prop
}) {
  return (
    <Container className={className}>
      <div className="wrapper max-w-[1920px] flex flex-col gap-5 mx-auto my-[3rem] items-center animate__animated wow animate__fadeInDown">
        {showH2 && (
          <h2 className="text-center h1">
            <span className="cucss">{h2normal}</span> {h2span}
          </h2>
        )}
        {showH3 && (
          <h3 className="text-center sm:text-2xl text-xl mb-4 font-medium text-gray-900">
            {h3}
          </h3>
        )}
        <p className="text-center p">{p}</p>
        {/* card wrapper */}
        <div className="card-wrapper max-w-[1370px] mx-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate__animated wow animate__fadeInLeft">
          {/* Map through the builds data */}

          {builds?.map((build, index) => (
            <EachBuildPc
              key={index}
              src={build.images[0]} // Get the first image from the images array
              alt={build.model} // Use model as alt text
              h3={build.shortTitle} // Show shortTitle for the card title
              span={`${build.components.cpu.model} - ${build.components.gpu.model}`} // Combine CPU and GPU models
              price={`PKR ${build.purchasePrice}`} // Show the purchasePrice
            />
          ))}
        </div>
        {/* button wrapper */}
        {showBtn && (
          <div className="flex justify-center 2xl:mb-[2rem]">
            <Button
              desc="Pre-Built Gaming PCs"
              src="/pre-build"
              className="main-btn mt-3"
            />
          </div>
        )}
      </div>
    </Container>
  );
}

export default EachSection;
