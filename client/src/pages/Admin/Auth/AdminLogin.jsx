import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminLogin = () => {
  const { apis, navigate, showSuccess } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, adminActions } = useReduxHooks();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (data) => {
    const formattedEmail = data.email.trim().replace(/\s/g, "");
    const formattedData = {
      email: formattedEmail,
      password: data.password,
    };

    const loginResponce = await apiSubmit({
      url: apis().userLogin.url,
      method: apis().userLogin.method,
      values: formattedData,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Logging in..., Please wait!",
    });

    if (loginResponce?.success && loginResponce?.data?.role === "admin") {
      showSuccess("Admin Login Successful!");
      dispatch(adminActions.setAuth(loginResponce?.data));
      navigate("/admin/");
    }
  };

  return (
    <section className="section py-4 laptop:py-10">
      <div className="w-[95%] mx-auto">
        <div className="card shadow-md m-auto w-full laptop:w-[31rem] rounded-md bg-white p-5 px-10">
          <h3 className="text-center laptop:text-lg text-base text-black">
            Login to your admin account
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit(handleLogin)}>
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email *"
                variant="outlined"
                className="w-full"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={showPassword ? "text" : "password"}
                id="password"
                label="Password *"
                variant="outlined"
                className="w-full"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              <Button
                className="!absolute top-2 right-2 !z-50 !w-9 !h-9 !min-w-9 !rounded-full !text-black opacity-75"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoMdEye className="text-xl" />
                ) : (
                  <IoIosEyeOff className="text-xl" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mt-3">
              <Button
                type="submit"
                disabled={loading}
                className="btn-org w-full "
              >
                {loading ? "Loading..." : "Login"}{" "}
                <CgLogIn className="text-xl ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default memo(AdminLogin);
