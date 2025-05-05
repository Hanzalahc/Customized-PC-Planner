import { useForm } from "react-hook-form";
import Container from "../../components/Container/Container";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "../../hooks/useReduxHooks";

function ForgotPassword() {
  const { apis, Link, navigate } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, protectedActions } = useReduxHooks();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const resetPassResponce = await apiSubmit({
      url: apis().userForgetPassword.url,
      method: apis().userForgetPassword.method,
      values: data,
      showLoadingToast: true,
      loadingMessage: "Sending reset link..., Please wait!",
    });

    if (resetPassResponce?.success) {
      dispatch(protectedActions.setResetPassPageAccess(true));
      setTimeout(() => {
        navigate("/signin");
      }, 5000);
    }
  };

  return (
    <main>
      <Container className={""}>
        {/* Wrapper */}
        <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
          {/* Sub Wrapper */}
          <div className="container mx-auto">
            {/* Sub Sub Wrapper */}
            <div className="max-w-md mx-auto my-10">
              {/* Heading Wrapper */}
              <div className="text-center">
                <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
                  Forgot Password
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your email to receive an OTP
                </p>
              </div>
              {/* Form Wrapper */}
              <div className="m-7">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Email Address
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
                      placeholder="you@company.com"
                      className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                    >
                      {loading ? "Loading..." : "Send OTP"}
                    </button>
                  </div>

                  <p className="text-sm text-center text-gray-400">
                    Remember your password?{" "}
                    <Link
                      to="/signin"
                      className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500"
                    >
                      Sign in
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default ForgotPassword;
