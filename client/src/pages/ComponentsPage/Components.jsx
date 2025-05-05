import React from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container/Container";

function Components() {
  return (
    <main>
      <Container className={""}>
        {/* werapper */}
        <div className="wrapper max-w-[1370px] mx-auto py-[3rem]">
          <section className="text-gray-900">
            {/* sub wrapper */}
            <div className="container px-5 py-24 mx-auto">
              {/* sub sub wrapper */}
              <div className="flex flex-wrap -m-4 text-center">
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInLeft">
                  <Link
                    to="/cpu"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      CPU/ Processor
                    </h2>
                  </div>
                </div>
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInLeft">
                  <Link
                    to="/cpu-cooler"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/00979205bfe0f63cf50f396392775b9f.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      CPU Cooler
                    </h2>
                  </div>
                </div>
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInLeft">
                  <Link
                    to="/motherboard"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/17b2fe7f91dc3d74fd0b7503dc6dd8ad.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      Motherboard
                    </h2>
                  </div>
                </div>
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInLeft">
                  <Link
                    to="/ram"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/835ab3efad1be13bbe53beef3e3c6f96.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      Memory/ RAM
                    </h2>
                  </div>
                </div>
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInRight">
                  <Link
                    to="/storage"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/3b2a91588d1a28bfa1b0184fb7f1c0a1.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      Storage
                    </h2>
                  </div>
                </div>
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInRight">
                  <Link
                    to="/gpu"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/232dd1c4ff3c7494fae18e5e99c878ce.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      Video Card/ GPU
                    </h2>
                  </div>
                </div>
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInRight">
                  <Link
                    to="/case"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/61eb5534e35ce8af07f25ff28197862b.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      Gaming Case
                    </h2>
                  </div>
                </div>
                {/* each */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInRight">
                  <Link
                    to="/psu"
                    className="block relative h-48 rounded overflow-hidden"
                  >
                    <img
                      alt="ecommerce"
                      className="object-contain object-center w-full h-full block"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/4c2a36634803871ec36077cba6cbac4f.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      Power Supply
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}

export default Components;
