import React, { memo, useEffect, useState } from "react";
import useReduxHooks from "../../hooks/useReduxHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useProvideHooks from "../../hooks/useProvideHooks";
import { Button } from "@mui/material";
import { ViewOrderProductModal } from "../";

const MyOrders = () => {
  const { auth, authActions, dispatch } = useReduxHooks();
  const { apis } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();

  const OrdersData = auth?.userData?.orderHistory || [];
  const [openModal, setOpenModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleOpenModal = (products) => {
    setSelectedProducts(products);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProducts([]);
  };

  const tableHeadRow = [
    "Order Id",
    "Products",
    "Payment Id",
    "Payment Status",
    "Name",
    "Email",
    "Phone No",
    "Address",
    "Pincode",
    "Total Amount",
    "Order Status",
    "Date",
  ];

  const fetchUserOrders = async () => {
    const response = await apiSubmit({
      url: apis().getUserOrders.url,
      method: apis().getUserOrders.method,
      successMessage: null,
      showLoadingToast: true,
    });

    if (response?.success) {
      console.log("User Orders", response?.data);
      dispatch(authActions.addOrderinOrderHistory(response?.data));
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className="card bg-white p-5 shadow-md rounded-md">
      <div className="py-5 px-3 border-b border-[rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-semibold">Your Orders</h2>
        <p className="mt-0">
          There are{" "}
          <span className="text-sm text-primary font-semibold">
            {OrdersData?.length || 0}{" "}
          </span>
          orders in your list.
        </p>
      </div>
      <div className="relative overflow-x-auto mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase font-medium bg-gray-50">
            <tr>
              {tableHeadRow.map((head, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {OrdersData?.length > 0 ? (
              OrdersData?.map((row, index) => (
                <tr
                  key={row._id}
                  className="bg-white border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 ">{row?._id || "Order Id"}</td>
                  <td className="px-6 py-4 ">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal(row?.products)}
                    >
                      View
                    </Button>
                  </td>
                  <td className="px-6 py-4 ">
                    {row?.paymentId || "Payment Id"}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      row?.paymentStatus === "pending"
                        ? "text-yellow-600 font-medium"
                        : row?.paymentStatus === "completed"
                        ? "text-green-600 font-medium"
                        : row?.paymentStatus === "failed"
                        ? "text-red-600 font-medium"
                        : row?.paymentStatus === "cod"
                        ? "text-blue-600 font-medium"
                        : ""
                    }`}
                  >
                    {row?.paymentStatus || "Payment Id"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {row?.userId?.name || "User Name"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row?.userId?.email || "User Email"}
                  </td>
                  <td className="px-6 py-4 ">
                    {row?.shippingAddress?.mobile || "User Mobile"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block w-96 text-xs">
                      {row?.shippingAddress?.addressLine || "Address Line"}
                    </span>
                  </td>
                  <td className="px-6 py-4 ">
                    {row?.shippingAddress?.pinCode || "Address pinCode"}
                  </td>
                  <td className="px-6 py-4 ">
                    {row?.totalAmount || "Total Amount"} Pkr
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        row?.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : row?.orderStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : row?.orderStatus === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : row?.orderStatus === "shipped"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {row?.orderStatus.charAt(0).toUpperCase() +
                        row?.orderStatus.slice(1) || "Order Status"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(row?.createdAt).toLocaleString() || "Date"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeadRow.length} className="text-center py-5">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Product Modal */}
      <ViewOrderProductModal
        open={openModal}
        onClose={handleCloseModal}
        products={selectedProducts}
      />
    </div>
  );
};

export default memo(MyOrders);
