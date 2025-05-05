import React, { memo, useState, useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { AddAddressModal } from "../";
import useReduxHooks from "../../hooks/useReduxHooks";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

const MyAddress = () => {
  const { authActions, dispatch, auth } = useReduxHooks();
  const { apis, showSuccess } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();

  const selectedAddressData = auth?.userData?.selectedAddress;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    selectedAddressData?._id || null
  );

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    showSuccess("Address selected successfully!");
    dispatch(authActions.selectedAddress(address));
  };

  const handleDelete = async (id) => {
    const deleteAddressResponse = await apiSubmit({
      url: apis().deleteAddress.url,
      method: apis().deleteAddress.method,
      values: { id },
      showLoadingToast: true,
      loadingMessage: "Deleting address..., Please wait!",
    });

    if (deleteAddressResponse.success) {
      const updatedAddresses = addresses.filter(
        (address) => address._id !== id
      );
      setAddresses(updatedAddresses);
      dispatch(authActions.removeUserAddress(id));

      if (selectedAddressId === id) {
        setSelectedAddressId(null);
        dispatch(authActions.selectedAddress(null));
      }
    }
  };

  const fetchAddresses = async () => {
    const fetchAddressesResponse = await apiSubmit({
      url: apis().getUserAllAddress.url,
      method: apis().getUserAllAddress.method,
      successMessage: null,
      showLoadingToast: true,
    });

    if (fetchAddressesResponse?.success) {
      setAddresses(fetchAddressesResponse?.data);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="card shadow-md rounded-md bg-white">
      <div className="py-5 px-3 border-b border-[rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-semibold">Your Addresses</h2>
        <p className="mt-0">
          You have{" "}
          <span className="text-sm text-primary font-semibold">
            {addresses.length}{" "}
          </span>{" "}
          saved addresses, Max limit is 3.
        </p>
        <AddAddressModal onAddAddress={fetchAddresses} />
      </div>

      <div className="flex gap-2 flex-col mt-4 py-5 px-3 border-b border-[rgba(0,0,0,0.1)]">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`address-item w-full p-4 flex items-center gap-3 border border-dashed border-[rgba(0,0,0,0.2)] rounded-md transition-all ${
              selectedAddressId === address._id
                ? "bg-[#e0f7fa]"
                : "bg-[#f1f1f1]"
            }`}
          >
            {/* Radio Button */}
            <input
              type="radio"
              name="selectedAddress"
              checked={selectedAddressId === address._id}
              onChange={() => handleSelectAddress(address)}
              className="cursor-pointer"
            />

            <div className="info w-full relative">
              <MdOutlineDelete
                className="link absolute right-2 text-lg transition-all top-2 cursor-pointer"
                onClick={() => {
                  handleDelete(address._id);
                }}
              />
              <span className="inline-block text-sm font-semibold text-primary">
                {`${
                  address?.addressType.charAt(0).toUpperCase() +
                  address?.addressType.slice(1)
                }`}
              </span>
              <h3 className="text-base font-semibold">{address.addressLine}</h3>
              <p className="text-sm text-gray-600">
                {address.city}, {address.state}, {address.pinCode},{" "}
                {address.country} - {address.mobile}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MyAddress);
