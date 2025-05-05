import { useForm } from "react-hook-form";
import Container from "../../components/Container/Container";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

function Contact() {
  const { Link, apis, loading } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const response = await apiSubmit({
      url: apis().contact,
      method: "POST",
      values: data,
      showLoadingToast: true,
      loadingMessage: "Submitting Form...",
    });
    response?.success ? reset() : null;
  };

  return (
    <main>
      <Container className="text-gray-600 body-font relative">
        {/* Wrapper */}
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          {/* Left image and map */}
          <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative animate__animated wow animate__fadeInLeft">
            <iframe
              className="absolute inset-0"
              width="100%"
              height="100%"
              frameBorder="0"
              title="map"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.7278824214677!2d73.14653207468768!3d30.64162569003158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922b6e4dde0c501%3A0xc37ea3d85326203!2sCOMSATS%20University%20Islamabad%20-%20Sahiwal%20Campus!5e0!3m2!1sen!2s!4v1723386348049!5m2!1sen!2s"
              style={{
                border: 0,
                filter: "grayscale(1) contrast(1.2) opacity(0.6)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Address box wrapper */}
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md z-10">
              {/* Address box left side */}
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  ADDRESS
                </h2>
                <p className="mt-1 text-sm text-gray-700">
                  Comsats University Sahiwal
                </p>
              </div>
              {/* Address box right side */}
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  EMAIL
                </h2>
                <Link
                  to="mailto:hanzala.hc@gmail.com"
                  className="text-indigo-500 leading-relaxed hover:underline"
                >
                  hanzala.hc@gmail.com
                </Link>
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                  PHONE
                </h2>
                <p className="leading-relaxed text-sm text-gray-700">
                  0303-0632356
                </p>
              </div>
            </div>
          </div>
          {/* Right description and feedback form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 animate__animated wow animate__fadeInRight p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl font-semibold text-gray-800">Feedback</h2>
            <p className="text-base text-gray-600 mt-4">
              Feel free to contact us and provide us with your valuable
              feedback.
            </p>

            {/* Name input */}
            <div className="relative mb-4 mt-6">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                {...register("name", { required: "Full name is required" })}
                type="text"
                id="name"
                name="name"
                className={`w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition duration-300 ease-in-out ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email input */}
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                type="email"
                id="email"
                name="email"
                className={`w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition duration-300 ease-in-out ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message input */}
            <div className="relative mb-4">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-600"
              >
                Message
              </label>
              <textarea
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                })}
                id="message"
                name="message"
                className={`w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none leading-6 transition duration-300 ease-in-out ${
                  errors.message ? "border-red-500" : ""
                }`}
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg transition-transform duration-300 transform hover:scale-105 motion-scale-in-[0.5] motion-translate-x-in-[-120%] motion-translate-y-in-[-60%] motion-opacity-in-[33%] motion-rotate-in-[-1080deg] motion-blur-in-[10px] motion-delay-[0.38s]/scale motion-duration-[0.38s]/opacity motion-duration-[1.20s]/rotate motion-duration-[0.15s]/blur motion-delay-[0.60s]/blur motion-ease-spring-bouncier"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}

export default Contact;
