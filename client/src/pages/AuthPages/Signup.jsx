import { set, useForm } from "react-hook-form";
import Container from "../../components/Container/Container";
import { FaEye, FaEyeSlash, FaCopy, FaCheck } from "react-icons/fa";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "./../../hooks/useReduxHooks";
// firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "./../../firebase/firebase";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function Signup() {
  const { apis, useState, Link, navigate, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, protectedActions, authActions } = useReduxHooks();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const onSubmit = async (data) => {
    const formattedName = data.name.trim().replace(/\s+/g, " ");
    const formattedEmail = data.email.trim().replace(/\s+/g, "").toLowerCase();
    const formattedData = {
      name: formattedName,
      email: formattedEmail,
      password: data.password,
    };

    const registerResponce = await apiSubmit({
      url: apis().userRegister.url,
      method: apis().userRegister.method,
      values: formattedData,
      successMessage:
        "Your account has been created successfully. Now you have to verify your email address",
      showLoadingToast: true,
      loadingMessage: "Creating account..., Please wait!",
    });

    if (registerResponce.success) {
      dispatch(protectedActions.setEmailVerifyPageAccess(true));
      setTimeout(() => {
        navigate("/signin");
      }, 5000);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;

      const user = result?.user;
      const googleData = {
        name: user?.displayName,
        email: user?.email,
        avatar: {
          url: user?.photoURL,
          publicId: null,
        },
        googleId: user?.uid,
      };

      const registerResponce = await apiSubmit({
        url: apis().userGoogleMethod.url,
        method: apis().userGoogleMethod.method,
        values: googleData,
        showLoadingToast: true,
        loadingMessage: "Signing in with Google..., Please wait!",
      });

      if (registerResponce?.success) {
        dispatch(
          authActions.setAuth({
            ...registerResponce?.data,
            method: "Google",
          })
        );
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.message;
      showError(`Failed to sign in: ${errorMessage}`);
    }
  };

  return (
    <main>
      <Container className={""}>
        {/* wrapper */}
        <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
          {/* sub wrapper */}
          <div className="container mx-auto">
            {/* sub sub wraper */}
            <div className="max-w-md mx-auto my-10">
              {/* heading wrapper */}
              <div className="text-center">
                <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
                  Sign up
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Create an account to get started
                </p>
              </div>
              {/* form wrapper */}
              <div className="m-7">
                {/* Google Authentication Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="flex items-center justify-center w-full py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleGoogleLogin}
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google logo"
                      className="w-5 h-5 mr-2"
                    />
                    Sign up with Google
                  </button>
                  <p className="block my-4 text-sm text-gray-600 dark:text-gray-400 ">
                    Or Fill the Form
                  </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Full Name */}
                  <div className="mb-6">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Full Name
                    </label>
                    <input
                      {...register("name", {
                        required: "Full name is required",
                      })}
                      type="text"
                      id="name"
                      placeholder="Faisal"
                      className={` w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } `}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  {/* Email */}
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
                      placeholder="you@company.com "
                      className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } `}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-6 relative">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Password
                    </label>

                    <input
                      {...register("password", {
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
                      id="password"
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
                      htmlFor="confirm_password"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Confirm Password
                    </label>

                    <input
                      {...register("confirm_password", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm_password"
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
                      disabled={loading}
                      type="submit"
                      className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                    >
                      {loading ? "Loading..." : "Sign up"}
                    </button>
                  </div>
                  <p className="text-sm text-center text-gray-400">
                    Already have an account?{" "}
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

export default Signup;
