import { useForm } from "react-hook-form";
import Container from "../../components/Container/Container";
import { FaEye, FaEyeSlash, FaCopy, FaCheck } from "react-icons/fa";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "./../../hooks/useReduxHooks";
// firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "./../../firebase/firebase";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function Signin() {
  const { apis, useState, Link, navigate, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, authActions } = useReduxHooks();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formattedEmail = data.email.trim();
    const formattedData = {
      email: formattedEmail,
      password: data.password,
    };

    const loginResponce = await apiSubmit({
      url: apis().userLogin.url,
      method: apis().userLogin.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Logging in..., Please wait!",
    });

    if (loginResponce?.success) {
      dispatch(authActions.setAuth(loginResponce?.data));
      navigate("/");
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
        <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto my-10">
              <div className="text-center">
                <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
                  Sign in
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Sign in to access your account
                </p>
              </div>
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
                    Sign in using Google
                  </button>
                  <p className="block my-4 text-sm text-gray-600 dark:text-gray-400 ">
                    Or Fill the Form
                  </p>
                </div>
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
                      name="email"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your Password"
                      className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />

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
                    <Link
                      to="/forgot-password"
                      className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className="mb-6">
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                    >
                      {loading ? "Loading..." : "Sign In"}
                    </button>
                  </div>

                  <p className="text-sm text-center text-gray-400">
                    Don&#x27;t have an account yet?{" "}
                    <Link
                      to="/signup"
                      className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800"
                    >
                      Sign up
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

export default Signin;
