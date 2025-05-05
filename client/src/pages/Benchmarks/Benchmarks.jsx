import React from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container/Container";

function Benchmarks() {
  return (
    <main>
      <Container className="">
        <div className="wrapper max-w-[1370px] mx-auto py-8">
          <section className="text-gray-900">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap justify-center gap-8">
                {/* CPU Card */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInLeft">
                  <Link
                    to="/cpu-benchmarks"
                    className="block relative h-56 rounded overflow-hidden"
                  >
                    <img
                      alt="CPU Benchmark"
                      className="object-contain object-center w-full h-full"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/c7baf2c9c9cc15ae23adb24c2f4316fc.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4 text-center">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      CPU / Processor Benchmarks
                    </h2>
                  </div>
                </div>

                {/* GPU Card */}
                <div className="lg:w-1/4 md:w-1/2 p-4 w-full animate__animated wow animate__fadeInRight">
                  <Link
                    to="/gpu-benchmarks"
                    className="block relative h-56 rounded overflow-hidden"
                  >
                    <img
                      alt="GPU Benchmark"
                      className="object-contain object-center w-full h-full"
                      src="https://cdna.pcpartpicker.com/static/forever/images/product/232dd1c4ff3c7494fae18e5e99c878ce.256p.jpg"
                    />
                  </Link>
                  <div className="mt-4 text-center">
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      GPU Benchmarks
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

export default Benchmarks;
