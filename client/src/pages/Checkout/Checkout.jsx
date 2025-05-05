import React, { memo, useMemo, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { PhoneInput } from "react-international-phone";
import { BsFillBagCheckFill } from "react-icons/bs";
import useProvideHooks from "../../hooks/useProvideHooks";
import useReduxHooks from "../../hooks/useReduxHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import { AddAddressModal } from "../../components";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { auth, authActions, dispatch, cart, cartActions } = useReduxHooks();
  const { apis, showSuccess, showError, navigate } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();

  const userData = auth?.userData || {};
  const userAllAddressData = userData?.addressDetails || [];
  const cartItems = cart?.cart || [];
  const [selectedUserAddress, setSelectedUserAddress] = useState(
    userData?.selectedAddress || {}
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    selectedUserAddress?._id || null
  );
  let wasStockReservedDuringStripeSession = false;

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    showSuccess("Address selected successfully!");
    dispatch(authActions.selectedAddress(address));
    setSelectedUserAddress(address);
  };

  const handlePlaceOrderByCOD = async () => {
    const orderData = {
      userId: userData?._id,
      products: cartItems?.map((item) => ({
        productId: item?._id,
        quantity: item?.quantity,
        name: item?.name,
      })),
      shippingAddress: selectedUserAddress?._id,
      paymentStatus: "cod",
      paymentId: "cod",
      totalAmount: totalPrice,
    };

    const response = await apiSubmit({
      url: apis().addOrder.url,
      method: apis().addOrder.method,
      values: orderData,
      showLoadingToast: true,
      loadingMessage: "Placing order...",
    });

    if (response?.success) {
      dispatch(cartActions.clearCart());

      navigate("/order-success");
    } else {
      navigate("/order-failed");
    }
  };

  //  create stripe session
  const handleStripePayment = async () => {
    const stripePromise = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLIC_KEY
    );
    const stripe = await stripePromise;

    const data = {
      amount: totalPrice,
      products: cartItems,
      email: userData.email,
      id: userData._id,
    };

    const response = await apiSubmit({
      url: apis().stripePayment.url,
      method: apis().stripePayment.method,
      values: data,
      showLoadingToast: true,
      loadingMessage: "Redirecting to Stripe...",
    });

    if (response?.success) {
      stripe.redirectToCheckout({ sessionId: response.session.id });
      wasStockReservedDuringStripeSession = response.stockReserved;
    } else {
      showError("Failed to initiate payment.");
    }
  };

  // check if user has done the payment on stripe session
  const checkStripePaymentStatus = async (sessionId) => {
    const response = await apiSubmit({
      url: `${apis().verifyPayment.url}?session_id=${sessionId}`,
      method: apis().verifyPayment.method,
      values: {
        products: cartItems,
        stockReserved: wasStockReservedDuringStripeSession,
      },
      showLoadingToast: true,
      successMessage: "Payment verified successfully!",
      loadingMessage: "Verifying payment...",
    });

    if (response?.success) {
      if (response.paymentStatus === "paid") {
        handlePlaceOrderByStripe(response.paymentStatus, response.paymentId);
      } else {
        showError("Payment failed!");
        navigate("/order-failed");
      }
    } else {
      showError("Failed to verify payment.");
    }
  };

  // if payment is done then create order on the backend
  const handlePlaceOrderByStripe = async (paymentStatus, paymentId) => {
    if (cartItems.length === 0) {
      return navigate("/order-success");
    }

    const orderData = {
      userId: userData?._id,
      products: cartItems?.map((item) => ({
        productId: item?._id,
        quantity: item?.quantity,
        name: item?.name,
      })),
      shippingAddress: selectedUserAddress?._id,
      paymentStatus: "completed",
      paymentId: paymentId,
      totalAmount: totalPrice,
      stockReserved: wasStockReservedDuringStripeSession,
    };

    const response = await apiSubmit({
      url: apis().addOrder.url,
      method: apis().addOrder.method,
      values: orderData,
      showLoadingToast: true,
      loadingMessage: "Placing order...",
    });

    if (response?.success) {
      dispatch(cartActions.clearCart());
      navigate("/order-success");
    } else {
      navigate("/order-failed");
    }
  };

  const removeSessionIdFromURL = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("session_id");
    window.history.replaceState({}, document.title, url.toString());
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item?.price * item?.quantity,
      0
    );
  }, [cartItems]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");

    if (sessionId) {
      checkStripePaymentStatus(sessionId);
      removeSessionIdFromURL();
    }
  }, []);

  return (
    <section className="laptop:py-10 py-3 px-3">
      <div className="mx-auto w-[95%] flex flex-col laptop:flex-row gap-5">
        <div className="left w-full laptop:w-[70%] ">
          <div className="card bg-white w-full shadow-md p-5 rounded-md">
            <h1 className="text-xl font-semibold">Address Details</h1>
            <p className="text-sm font-medium mt-3">
              The following addresses will be used as your default billing and
              shipping address. You have a limit of 3 addresses. Change them as
              you like in your account section.
            </p>
            {userAllAddressData?.length < 3 && <AddAddressModal />}

            <div className="flex gap-2 flex-col mt-4 py-5 px-3 border-b border-[rgba(0,0,0,0.1)]">
              {userAllAddressData?.length > 0 ? (
                userAllAddressData?.map((address) => (
                  <div
                    key={address?._id}
                    className={`address-item w-full p-4 flex items-center gap-3 border border-dashed border-[rgba(0,0,0,0.2)] rounded-md cursor-pointer transition-all ${
                      selectedAddressId === address?._id
                        ? "bg-[#e0f7fa]"
                        : "bg-[#f1f1f1]"
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    {/* Radio Button */}
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === address?._id}
                      onChange={() => handleSelectAddress(address)}
                      className="cursor-pointer"
                    />

                    <div className="info w-full relative">
                      <span className="inline-block text-sm font-semibold text-primary">
                        {`${
                          address?.addressType.charAt(0).toUpperCase() +
                            address?.addressType.slice(1) || "Home"
                        }`}
                      </span>
                      <h3 className="text-base font-semibold">
                        {address?.addressLine || "House No. and Street Name"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {address?.city}, {address?.state}, {address?.pinCode},{" "}
                        {address?.country} - {address?.mobile}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-medium text-gray-500">
                  You have no saved addresses, please add one.
                </p>
              )}
            </div>

            <form className="w-full mt-5">
              <div className="flex items-center flex-col laptop:flex-row gap-5  pb-5">
                <div className="col w-full laptop:w-[50%]">
                  <TextField
                    id="outlined-basic"
                    type="text"
                    className="w-full"
                    value={userData.name || ""}
                    label="Full Name *"
                    disabled
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div className="col w-full laptop:w-[50%]">
                  <TextField
                    id="outlined-basic"
                    value={userData.email || ""}
                    type="email"
                    disabled
                    className="w-full"
                    label="Email *"
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>
              <div className="flex items-center gap-5  pb-5">
                <div className="col w-full">
                  <PhoneInput
                    defaultCountry="pk"
                    value={selectedUserAddress?.mobile || "Please add address"}
                    placeholder="Enter mobile number"
                    disabled
                    style={{
                      fontSize: "16px",
                      height: "50px",
                    }}
                    inputStyle={{
                      width: "100%",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>
              <h4 className="text-sm font-medium mb-3">
                <strong>Street Address</strong>
              </h4>
              <div className="flex items-center gap-5 pb-5">
                <div className="col w-full">
                  <TextField
                    id="outlined-basic"
                    type="text"
                    disabled
                    value={
                      selectedUserAddress?.addressLine || "Please add address"
                    }
                    className="w-full"
                    label="House No. and Street Name *"
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              <h4 className="text-sm font-medium mb-3">
                <strong>Town/ City/ Country Details</strong>
              </h4>
              <div className="flex flex-col laptop:flex-row items-center gap-5  pb-5">
                <div className="col w-full laptop:w-[50%]">
                  <TextField
                    id="outlined-basic"
                    type="text"
                    disabled
                    value={selectedUserAddress?.city || "Please add address"}
                    className="w-full"
                    label="City *"
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div className="col w-full laptop:w-[50%]">
                  <TextField
                    id="outlined-basic"
                    type="text"
                    disabled
                    className="w-full"
                    label="State *"
                    value={selectedUserAddress?.state || "Please add address"}
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div className="col w-full laptop:w-[50%]">
                  <TextField
                    id="outlined-basic"
                    type="text"
                    disabled
                    value={selectedUserAddress?.country || "Please add address"}
                    className="w-full"
                    label="Country *"
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>
              <h4 className="text-sm font-medium mb-3">
                <strong>Zip/ Postcode</strong>
              </h4>
              <div className="flex items-center gap-5  pb-5">
                <div className="col w-full">
                  <TextField
                    id="outlined-basic"
                    disabled
                    value={selectedUserAddress?.pinCode || "Please add address"}
                    type="text"
                    className="w-full"
                    label="Zip Code *"
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="right w-full laptop:w-[30%]">
          <div className="card shadow-md bg-white p-5 rounded-md">
            <h2 className="text-lg font-semibold mb-4">
              Your Order
              <span className="text-sm font-medium">
                ({cartItems.length || 0} items)
              </span>
            </h2>
            <div className="flex items-center py-3 justify-between border-y border-[rgba(0,0,0,0.1)]">
              <span className="text-xs font-semibold">Product</span>
              <span className="text-xs font-semibold">Sub Total</span>
            </div>
            <div className="scroll max-h-64 overflow-y-scroll overflow-x-hidden pr-2 mb-5">
              {cartItems?.length > 0 &&
                cartItems?.map((product) => (
                  <div
                    key={product?._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="part1 flex items-center gap-3">
                      <div className="img w-16 h-16 object-cover overflow-hidden rounded-md group cursor-pointer transition-all">
                        <Link to={`/product/${product?._id}`}>
                          <img
                            src={
                              product.images && product.images[0]?.url
                                ? product.images[0].url
                                : "/default-image.jpg"
                            }
                            alt={product?.name}
                            className="w-full transition-all group-hover:scale-105"
                          />
                        </Link>
                      </div>
                      <div className="info">
                        <h4 className="text-xs font-medium">
                          {product?.name.substring(0, 40) || "Product Name"}...
                        </h4>
                        <span className="text-xs font-medium">
                          x{product?.quantity || 1}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold">
                      Pkr{" "}
                      {product?.price * product?.quantity || "Product Price"}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[rgba(0,0,0,0.1)] ">
              <span className="text-xs font-semibold">Total</span>
              <span className="text-xs font-semibold">Pkr {totalPrice}</span>
            </div>
            <Button
              disabled={
                !selectedUserAddress?._id || loading || !cartItems.length
              }
              onClick={handlePlaceOrderByCOD}
              className="!bg-primary hover:!bg-black flex gap-2 !text-white !w-full !mb-5"
            >
              <BsFillBagCheckFill className=" text-xl text-white " />{" "}
              {selectedUserAddress?._id ? (
                cartItems.length > 0 ? (
                  <span>
                    {loading ? "Placing Order..." : "Place Order by COD"}
                  </span>
                ) : (
                  <span>Cart is empty</span>
                )
              ) : (
                <span>Please select address</span>
              )}
            </Button>
            <Button
              disabled={
                !selectedUserAddress?._id || loading || !cartItems.length
              }
              onClick={handleStripePayment}
              className="!bg-blue-500 hover:!bg-black flex gap-2 !text-white !w-full"
            >
              <BsFillBagCheckFill className=" text-xl text-white " />{" "}
              {selectedUserAddress?._id ? (
                cartItems.length > 0 ? (
                  <span>
                    {loading ? "Placing Order..." : "Pay With Stripe"}
                  </span>
                ) : (
                  <span>Cart is empty</span>
                )
              ) : (
                <span>Please select address</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Checkout);
