import { useForm } from "react-hook-form";
import Container from "../../components/Container/Container";
import { FaEye, FaEyeSlash, FaCopy, FaCheck } from "react-icons/fa";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "../../hooks/useReduxHooks";

function ChangePassword() {
  const { apis, loading, Link, showError, navigate, useEffect, useState } =
    useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { dispatch, protectedActions, protectedPage } = useReduxHooks();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const resetPassPageAccess = protectedPage?.resetPassPageAccess || false;

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!resetPassPageAccess) {
      showError("Unauthorized Request!");
      navigate("/");
      return;
    }
  }, []);

  const onSubmit = async (data) => {
    const newPassword = data?.new_password;
    const resetPassResponce = await apiSubmit({
      url: apis().userResetPassword.url,
      method: apis().userResetPassword.method,
      values: { newPassword },
      showLoadingToast: true,
      loadingMessage: "Resetting password..., Please wait!",
    });

    if (resetPassResponce?.success) {
      dispatch(protectedActions.setResetPassPageAccess(false));
      navigate("/signin");
    }
  };

  return (
    <main>
      <Container>
        <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto my-10">
              <div className="text-center">
                <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
                  Change Password
                </h1>
              </div>
              <div className="m-7">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Password */}
                  <div className="mb-6 relative">
                    <label
                      htmlFor="new_password"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Password
                    </label>

                    <input
                      {...register("new_password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*[@$!%*?&.,/])[A-Za-z\d@$!%*?&.,/]{8,}$/,
                          message:
                            "Password must have 1 uppercase letter and 1 special character",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      id="new_password"
                      placeholder="Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <PasswordStrengthMeter password={password} />

                    {/* Show/Hide Password Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-10 right-10 text-gray-600 dark:text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                    {/* Copy Password Button */}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="absolute top-10 right-4 text-gray-600 dark:text-gray-400"
                      title="Copy password"
                    >
                      {copied ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>

                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  {/* Confirm Password */}
                  <div className="mb-6 relative">
                    <label
                      htmlFor="confirm_new_password"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Confirm Password
                    </label>

                    <input
                      {...register("confirm_new_password", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("new_password") ||
                          "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm_new_password"
                      placeholder="Confirm Your Password"
                      className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 ${
                        errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-300"
                      } `}
                    />

                    {/* Show/Hide Confirm Password Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute top-10 right-10 text-gray-600 dark:text-gray-400"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                    {errors.confirm_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                  {/* Submit Button */}
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none"
                    >
                      {loading ? "Loading..." : "Change Password"}
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

export default ChangePassword;
