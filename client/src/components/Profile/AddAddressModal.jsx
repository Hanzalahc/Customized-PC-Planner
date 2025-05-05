import React, { useState, memo } from "react";
import { Modal, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import Select from "react-select";
import "react-international-phone/style.css";
import useReduxHooks from "../../hooks/useReduxHooks";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

const AddAddressModal = ({ onAddAddress }) => {
  const { auth, authActions, dispatch } = useReduxHooks();
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const userData = auth?.userData;
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlleAddAddress = async (data) => {
    const formattedMobile = data?.mobile.replace(/-/g, "");

    const phoneRegex = /^\+?[0-9]+(\s[0-9]+)*$/;
    if (!phoneRegex.test(formattedMobile)) {
      showError("Invalid phone number format");
      return;
    }

    const formattedData = {
      mobile: formattedMobile,
      addressType: data.addressType.value,
      addressLine: data.addressLine.trim().replace(/\s+/g, " "),
      city: data.city.trim().replace(/\s+/g, " "),
      state: data.state.trim().replace(/\s+/g, " "),
      pinCode: data.pinCode.trim().replace(/\s+/g, " "),
      country: data.country.trim().replace(/\s+/g, " "),
    };

    const addAddressResponce = await apiSubmit({
      url: apis().addAddress.url,
      method: apis().addAddress.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Adding address..., Please wait!",
    });

    if (addAddressResponce.success) {
      dispatch(authActions.setUserAddress(addAddressResponce.data));
      reset();
      handleClose();
      onAddAddress();
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center mt-4 gap-4 border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer p-3 rounded-md"
        onClick={handleOpen}
      >
        Add Address
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: "90%",
            maxWidth: 500,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <form
            className="space-y-4"
            onSubmit={handleSubmit(handlleAddAddress)}
          >
            <h2 className="text-lg font-semibold">Add Address</h2>

            <div>
              <PhoneInput
                defaultCountry="pk"
                value={userData?.mobile || ""}
                placeholder="Enter mobile number"
                {...register("mobile", {
                  required: "Mobile number is required",
                })}
                style={{
                  fontSize: "16px",
                  height: "50px",
                }}
                inputStyle={{
                  width: "100%",
                  fontSize: "16px",
                }}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Address Type</label>
              <Controller
                name="addressType"
                rules={{ required: "Address type is required" }}
                control={control}
                defaultValue={{ value: "home", label: "Home" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "home", label: "Home" },
                      { value: "work", label: "Work" },
                    ]}
                    isSearchable={false}
                    isClearable={false}
                    placeholder="Select address type"
                    className="w-full"
                  />
                )}
              />
              {errors.addressType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.addressType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Address Line</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your address line"
                {...register("addressLine", {
                  required: "Address line is required",
                  minLength: {
                    value: 5,
                    message: "Address line must be at least 5 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Address line must not exceed 100 characters",
                  },
                })}
              />
              {errors.addressLine && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.addressLine.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your city"
                {...register("city", {
                  required: "City is required",
                  minLength: {
                    value: 2,
                    message: "City must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "City must not exceed 50 characters",
                  },
                })}
              />

              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium">State</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your state"
                {...register("state", {
                  required: "State is required",
                  minLength: {
                    value: 2,
                    message: "State must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "State must not exceed 50 characters",
                  },
                })}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-sm font-medium">Pin Code</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your pin code 6 digits"
                {...register("pinCode", {
                  required: "Pin code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Invalid pin code",
                  },
                })}
              />
              {errors.pinCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pinCode.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium">Country</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your country"
                {...register("country", {
                  required: "Country is required",
                  minLength: {
                    value: 2,
                    message: "Country must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Country must not exceed 50 characters",
                  },
                })}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-primary hover:bg-black rounded-md"
              >
                {loading ? "Adding..." : "Add Address"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default memo(AddAddressModal);
