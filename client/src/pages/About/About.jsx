import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <main>
      {/* wrapper */}

      <div className="py-16 bg-gradient-to-r from-gray-100 to-gray-200 my-[3rem]">
        {/* sub wrapper */}
        <div className="container mx-auto px-6 text-gray-700 md:px-12 xl:px-6">
          {/* sub sub wrapper */}
          <div className="space-y-8 md:space-y-0 md:flex md:gap-10 lg:items-center lg:gap-20">
            {/* left image */}
            <div className="md:w-5/12 lg:w-5/12 animate__animated wow animate__fadeInLeft">
              <img
                src="./assets/about.svg"
                alt="About Us"
                className="w-full h-auto rounded-xl shadow-lg transform transition duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* right description */}
            <div className="md:w-7/12 lg:w-6/12 animate__animated wow animate__fadeInRight">
              <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                About Customized PC Planner
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                At{" "}
                <span className="font-semibold text-gray-900">
                  Custom PC Advisor
                </span>
                , we're passionate about empowering tech enthusiasts and
                professionals to build their dream PCs. Our mission is to
                simplify the process of selecting and purchasing the perfect
                components by offering expert recommendations, detailed
                compatibility checks, and up-to-date benchmark scores.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                With a dedicated team of industry professionals, we’re committed
                to providing a seamless experience whether you're a seasoned
                builder or new to the world of custom PCs. Our platform not only
                guides you in choosing the right parts but also offers the
                convenience of purchasing through trusted affiliates or directly
                from our store.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Join us on a journey to create the ultimate computing
                experience, tailored just for you.
              </p>

              {/* Call to Action */}
              <div className="mt-8">
                <Link
                  to="/"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-gradient-to-l hover:shadow-lg transform transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;
