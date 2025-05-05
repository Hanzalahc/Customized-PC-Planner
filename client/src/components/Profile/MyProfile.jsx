import React, { memo } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import useReduxHooks from "../../hooks/useReduxHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useProvideHooks from "../../hooks/useProvideHooks";
import { Link } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const MyProfile = () => {
  const { auth, authActions, dispatch } = useReduxHooks();
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();

  const userData = auth?.userData || {};
  const isLoginMethodNotGoogle = auth?.userData?.method !== "Google" || false;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleUserUpdate = async (data) => {
    const formattedEmail = data.email.trim().replace(/\s+/g, "").toLowerCase();
    const formattedName = data.name.trim().replace(/\s+/g, " ");
    const formattedMobile = data.mobile ? data.mobile.replace(/-/g, "") : "";

    if (
      formattedEmail === userData?.email &&
      formattedName === userData?.name &&
      formattedMobile === userData?.mobile
    ) {
      showError("No changes made to update");
      return;
    }

    // if phone is provided, validate it
    const phoneRegex = /^\+?[0-9]+(\s[0-9]+)*$/;

    if (formattedMobile && !phoneRegex.test(formattedMobile)) {
      showError("Invalid phone number format");
      return;
    }

    const formattedData = {
      name: formattedName,
      email: formattedEmail,
      mobile: formattedMobile,
    };

    const userUpdateResponce = await apiSubmit({
      url: apis().userUpdateDetails.url,
      method: apis().userUpdateDetails.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Logging in..., Please wait!",
    });

    if (userUpdateResponce?.success) {
      const data = {
        email: userUpdateResponce.data?.email,
        name: userUpdateResponce.data?.name,
        mobile: userUpdateResponce.data?.mobile,
      };
      dispatch(authActions.setUserDetails(data));
      setValue("name", userUpdateResponce.data?.name);
      setValue("email", userUpdateResponce.data?.email);
      setValue("mobile", userUpdateResponce.data?.mobile);
    }
  };

  return (
    <div className="card bg-white p-5 shadow-md rounded-md">
      {isLoginMethodNotGoogle && (
        <div className="flex items-center pb-3">
          <h2 className="pb-3 text-xl font-semibold">My Profile</h2>
          <Link to="/forget-password" className="ml-auto text-primary">
            <Button className="!ml-auto">Change Password?</Button>
          </Link>
        </div>
      )}
      <hr />

      <form className="mt-8" onSubmit={handleSubmit(handleUserUpdate)}>
        <div className="flex flex-col laptop:flex-row items-center gap-5 ">
          <div className="w-full laptop:w-[50%]">
            <TextField
              id="outlined-basic"
              label="Full Name"
              className="w-full"
              defaultValue={userData?.name || ""}
              variant="outlined"
              size="small"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Name must not exceed 30 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full laptop:w-[50%]">
            <TextField
              id="outlined-basic"
              label="Email"
              disabled
              defaultValue={userData?.email || ""}
              className="w-full"
              variant="outlined"
              size="small"
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
        </div>
        <div className="flex items-center mt-4 gap-5 ">
          <div className="w-full">
            <PhoneInput
              defaultCountry="pk"
              value={userData?.mobile || ""}
              placeholder="Enter mobile number"
              {...register("mobile")}
              style={{
                fontSize: "16px", // Increase the font size for better visibility
                height: "50px", // Adjust height to make the input larger
              }}
              inputStyle={{
                width: "100%", // Ensures it spans the entire width
                fontSize: "16px", // Increase input font size
              }}
            />
          </div>
        </div>
        <div className="flex items-center mt-4 gap-4">
          <Button
            disabled={loading}
            type="submit"
            className="!bg-primary hover:!bg-black flex gap-2 w-full !text-white"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default memo(MyProfile);
