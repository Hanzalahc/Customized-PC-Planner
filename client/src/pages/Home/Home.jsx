import {
  Container,
  Button,
  BuyButton,
  PopularTabs,
} from "../../components/index";
import FaqWrapper from "./FaqWrapper";
import CompaniesLineWrapper from "./CompaniesLineWrapper";
import EachSection from "../PreBuild/EachSection";
import useApiSubmit from "../../hooks/useApiSubmit";
import useProvideHooks from "../../hooks/useProvideHooks";

function Home() {
  const { useEffect, useState, Link, apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const [featureData, setFeatureData] = useState([]);

  // to show name on home page using api
  useEffect(() => {
    const showAllFeature = async () => {
      const response = await apiSubmit({
        url: apis().getPrebuildDropdown.url,
        method: apis().getPrebuildDropdown.method,
        successMessage: null,
        showLoadingToast: false,
        loadingMessage: "Fetching...",
      });

      if (response?.success) {
        setFeatureData(response.data.prebuilds);
      }
    };

    showAllFeature();
  }, []);

  return (
    <main>
      {/* Hero Section Start*/}
      <Container className="text-gray-600 bg-gradient-to-b from-purple-50 via-orange-50 to-transparent ">
        {/* hero wrapper */}
        <div className="wrapper container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          {/* sub wrapper left */}
          <div className="left-wrapper lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center animate__animated wow animate__fadeInLeft">
            <h1 className="h1">
              Build Your Perfect PC with <br />
              <span className="cucss">Expert Guidance</span>, readymade and
              customized available.
            </h1>
            <p className="p">
              Whether you're a gamer, freelancer, or tech enthusiast,
              CustomPcAdvisor helps you create the ideal custom PC. Input your
              requirements and budget, and our advanced system will recommend
              the best components, complete with benchmarks, compatibility
              checks, and purchase options—all in one place.
            </p>
            {/* button wrapper */}
            <div className="flex justify-center">
              <Button desc="Ready Made" src="./pre-Build"></Button>
              {/* <Button desc="Ask AI" src="/chatbot"></Button> */}
              <BuyButton desc="Custom Build" src="/custom-build"></BuyButton>
            </div>
          </div>
          {/* sub wrapper right */}
          <div className="right-wrapper lg:max-w-lg lg:w-full md:w-1/2 w-5/6 animate__animated wow animate__fadeInRight">
            <img
              className="object-cover object-center rounded animate-float"
              alt="hero"
              src="../assets/hero section.webp"
            />
          </div>
        </div>
        {/* companies wrapper */}
        <div
          id="companies-container"
          className="flex flex-col gap-10 mb-[3rem]"
        >
          {/* heading wrapper */}
          <div id="companies-title" className="flex justify-center gap-2">
            <img className="translate-y-2" src="../assets/asset 2.svg" alt="" />
            <span className="font-semibold">We have it All</span>
            <img
              className="-scale-x-100 translate-y-2"
              src="../assets/asset 2.svg"
              alt=""
            />
          </div>
          {/* line warpper */}
          <CompaniesLineWrapper></CompaniesLineWrapper>
        </div>
        {/* companies wrapper*/}
      </Container>
      {/* Hero Section End*/}

      {/* Pre-Built Gaming PCs Start */}

      <EachSection
        h2normal="Featured"
        h2span="PC's"
        h3="Best value for money builds"
        p="Get the perfect blend of performance and value with this build, tailored for gamers who want high-quality gameplay without breaking the bank."
        className="section"
        showH2={true}
        showH3={false}
        showBtn={true}
        builds={featureData?.filter((build) => build.isFeatured === true)} // Pass featured builds data
      />

      {/* Pre-Built Gaming PCs End */}

      {/* Popular Products */}
      <PopularTabs products={featureData}></PopularTabs>
      {/* Popular Products End */}

      {/* Why Choose Start */}
      <Container className="section">
        {/* wrapper */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-[3rem]">
          {/* upper wraper */}
          <div className="mx-auto max-w-xl text-center animate__animated wow animate__fadeInDown">
            <h2 className="h1">
              Why <span className="cucss">Choose</span> Customized PC Planner?
            </h2>
            <p className="mt-4 p">
              Building your dream PC has never been easier. Here’s why
              CustomPcAdvisor stands out as your go-to platform for all your
              custom PC needs.
            </p>
          </div>
          {/* lower wrapper */}
          <div className="mt-12 grid grid-cols-1 gap-y-8 text-center sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
            {/* each */}
            <div className="animate__animated wow animate__fadeInLeft transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 text-gray-700 transition-colors duration-300"
                >
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black transition-colors duration-300">
                Expert Recommendations
              </h3>
              <p className="mt-4 text-gray-600 transition-colors duration-300">
                Our system provides tailored component suggestions based on your
                specific requirements and budget, ensuring you get the best
                performance for your money.
              </p>
            </div>

            {/* each */}
            <div className="animate__animated wow animate__fadeInLeft transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 text-gray-700 transition-colors duration-300"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black transition-colors duration-300">
                Comprehensive Benchmarks
              </h3>
              <p className="mt-4 text-gray-600 transition-colors duration-300">
                We offer detailed CPU and GPU benchmark scores, so you know
                exactly how each component performs before making a decision.
              </p>
            </div>

            {/* each */}
            <div className="animate__animated wow animate__fadeInRight transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 text-gray-700 transition-colors duration-300"
                >
                  <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black transition-colors duration-300">
                Compatibility Assurance
              </h3>
              <p className="mt-4 text-gray-600 transition-colors duration-300">
                With our bottleneck calculator, you can rest assured that all
                your selected parts will work seamlessly together for optimal
                performance.
              </p>
            </div>

            {/* each */}
            <div className="animate__animated wow animate__fadeInRight transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 text-gray-700 transition-colors duration-300"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black transition-colors duration-300">
                One-Stop Shop
              </h3>
              <p className="mt-4 text-gray-600 transition-colors duration-300">
                Easily purchase your recommended components directly through our
                platform or via our affiliated links, all in one convenient
                place.
              </p>
            </div>
          </div>
        </div>
      </Container>
      {/* Why Choose End */}

      {/* Trusted by Start */}
      <Container className="section">
        {/* wrapper */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-[3rem]">
          {/* sub wraper */}
          <div className="mx-auto max-w-xl text-center animate__animated wow animate__fadeInDown">
            <h2 className="h1">
              Trusted by Thousands of{" "}
              <span className="cucss">Satisfied Customers</span>
            </h2>
            <p className="mt-4 p">
              Join a growing community of tech enthusiasts and gamers who have
              successfully built their dream PCs with CustomPcAdvisor. See what
              they have to say about their experience.
            </p>
            {/* lower sub sub wraper */}
            <div className="max-w-screen-2xl px-4 py-2 mx-auto text-center lg:py-6 lg:px-6">
              <dl className="grid max-w-screen-md gap-8 mx-auto sm:grid-cols-3 dark:text-white">
                {/* each */}

                <div className="flex flex-col items-center justify-center animate__animated wow animate__fadeInLeft transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
                  <dt className="h1 mb-2 duration-1000 text-4xl font-bold text-gray-800 animate-bounce">
                    500+
                  </dt>
                  <dd className="text-gray-600 text-lg">PCs built</dd>
                </div>

                {/* each */}
                <div className="flex flex-col items-center justify-center animate__animated wow animate__fadeInUp transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
                  <dt className="h1 mb-2 duration-1000 text-4xl font-bold text-gray-800 animate-bounce">
                    300+
                  </dt>
                  <dd className="text-gray-600 text-lg">
                    budget-friendly gaming rigs created
                  </dd>
                </div>

                {/* each */}
                <div className="flex flex-col items-center justify-center animate__animated wow animate__fadeInRight transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
                  <dt className="h1 mb-2 duration-1000 text-4xl font-bold text-gray-800 animate-bounce">
                    400+
                  </dt>
                  <dd className="text-gray-600 text-lg">
                    high-performance setups customized
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
      {/* Trusted by End */}

      {/* OUR TEAM Start */}
      <Container className="section">
        {/* wrapper */}
        <div className="container px-5 py-24 mx-auto">
          {/* upper sub wraper */}
          <div className="flex flex-col text-center w-full mb-20 animate__animated wow animate__fadeInDown">
            <h1 className="h1">
              <span className="cucss">OUR TEAM</span>
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed p">
              Our team at CustomPcAdvisor is made up of passionate tech
              enthusiasts, experienced developers, and dedicated support
              professionals. Together, we combine our expertise to provide you
              with the best tools and guidance to build your perfect PC. We’re
              committed to helping you every step of the way, ensuring you have
              a seamless and enjoyable experience.
            </p>
          </div>
          {/* lower sub wrapper */}
          <div className="flex flex-wrap -m-4 justify-center">
            {/* each */}
            <div className="flex flex-col items-center justify-center animate__animated wow animate__fadeInLeft transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
              <div className="h-full flex flex-col items-center text-center">
                <div className="w-full">
                  <h2 className="title-font font-medium text-lg text-gray-900">
                    Faisal Hafeez
                  </h2>
                  <h3 className="text-gray-500 mb-3">Backend Developer</h3>
                  <p className="mb-4">
                    My expertise lies in backend development using Laravel and
                    PHP.
                  </p>
                  <span className="inline-flex">
                    <Link className="text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </Link>
                    <Link className="ml-2 text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </Link>
                    <Link className="ml-2 text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                      </svg>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            {/* each */}
            <div className="flex flex-col items-center justify-center animate__animated wow animate__fadeInRight transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300">
              <div className="h-full flex flex-col items-center text-center">
                <div className="w-full">
                  <h2 className="title-font font-medium text-lg text-gray-900">
                    Hanzala Chaudhary
                  </h2>
                  <h3 className="text-gray-500 mb-3">Frontend Developer</h3>
                  <p className="mb-4">
                    My expertise is in MERN development, Node.js, MongoDB, and
                    React.js.
                  </p>
                  <span className="inline-flex">
                    <Link className="text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </Link>
                    <Link className="ml-2 text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </Link>
                    <Link className="ml-2 text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                      </svg>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            {/* each */}
            <div className="flex flex-col items-center justify-center animate__animated wow animate__fadeInRight transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-lg p-6 hover:border-transparent hover:ring-2 hover:ring-gray-300  ">
              <div className="h-full flex flex-col items-center text-center">
                <div className="w-full">
                  <h2 className="title-font font-medium text-lg text-gray-900">
                    Farhan Amjad
                  </h2>
                  <h3 className="text-gray-500 mb-3">Full Stack</h3>
                  <p className="mb-4">
                    I streamline workflows by managing projects, budgets,
                    contacts, and communications, ensuring tasks are completed
                    efficiently.
                  </p>
                  <span className="inline-flex">
                    <Link className="text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </Link>
                    <Link className="ml-2 text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </Link>
                    <Link className="ml-2 text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                      </svg>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/* OUR TEAM End */}

      {/* FAQ Start */}
      <Container className="section">
        {/* wrapper */}
        <FaqWrapper></FaqWrapper>
      </Container>
      {/* FAQ End */}
    </main>
  );
}

export default Home;
