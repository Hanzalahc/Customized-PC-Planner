import React, { memo, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import { Button } from "@mui/material";
import { UpdateOrderStatusModal } from "../index";
import { ViewOrderProductModal } from "../../";
import Pagination from "@mui/material/Pagination";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";

const AdminHomeRecentOrders = () => {
  const { apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  

  const [ordersData, setOrdersData] = useState([]);
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const fecthOrders = async (page) => {
    const response = await apiSubmit({
      url: `${apis().getAllOrders.url}`,
      method: apis().getAllOrders.method,
      query: { pageNum: page },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response?.success) {
      setOrderTotalPages(response.totalPages);
      setOrdersData(response.data);
    }
  };

  const handleOrderPageChange = (event, page) => {
    setOrderCurrentPage(page);
    fecthOrders(page);
  };

  const handleStatusFilter = async (status) => {
    if (!status) {
      fecthOrders(orderCurrentPage);
      return;
    }

    const response = await apiSubmit({
      url: `${apis().orderFilters.url}`,
      method: apis().orderFilters.method,
      query: { pageNum: orderCurrentPage, status },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setOrdersData(response.data);
      setOrderTotalPages(response.totalPages);
    } else {
      fecthOrders(orderCurrentPage);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return ordersData;

    return ordersData.filter(
      (order) =>
        order?.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.userId?.mobile && order?.userId?.mobile.includes(searchQuery)) ||
        order?._id.includes(searchQuery) ||
        order?.paymentId.includes(searchQuery) ||
        order?.shippingAddress?.addressLine
          .toLowerCase()
          .includes(searchQuery) ||
        order?.orderStatus.includes(searchQuery) ||
        order?.paymentStatus.includes(searchQuery) ||
        order?.shippingAddress?.pinCode.includes(searchQuery) ||
        new Date(order?.createdAt).toLocaleString().includes(searchQuery)
    );
  }, [ordersData, searchQuery]);

  const handleOpenModal = (products) => {
    setSelectedProducts(products);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProducts([]);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusModalOpen(true);
  };

  useEffect(() => {
    fecthOrders(orderCurrentPage);
  }, []);

  return (
    <div className="card my-4 bg-white tablet:rounded-lg shadow-md ">
      <div className="flex items-center justify-between px-5 py-5">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
      </div>
      <div className="flex items-end  w-full px-5  gap-5">
        <div className="col w-[20%]">
          <h4 className="font-semibold text-sm mb-2">Filter By Order Status</h4>
          <Select
            className="w-full"
            size="small"
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            defaultValue={{
              value: "",
              label: "All",
            }}
            options={
              [
                { value: "", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
              ] || []
            }
            onChange={(e) => {
              handleStatusFilter(e.value);
            }}
          />
        </div>

        {/* <div className="col w-[20%]">
          <h4 className="font-semibold text-sm mb-2">
            Filter By Payment Status
          </h4>
          <Select
            className="w-full"
            size="small"
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            defaultValue={{
              value: "",
              label: "All",
            }}
            options={
              [
                { value: "", label: "All" },
                { value: "true", label: "True" },
                { value: "false", label: "False" },
              ] || []
            }
            onChange={(e) => {
              handleEmailVerifiedFilter(e.value);
            }}
          />
        </div> */}

        <div className="col w-[20%] ml-auto">
          <div className="w-full h-auto  bg-whitebg relative overflow-hidden">
            <IoSearch className="absolute top-3 left-3 z-50 pointer-events-none opacity-80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here..."
              className="w-full h-10 p-2 pl-8 border border-[rgba(0,0,0,0.1)] bg-whitebg focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-md text-sm"
            />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto mt-5 pb-5">
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
            {filteredOrders?.length > 0 ? (
              filteredOrders?.map((row, index) => (
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
                    <Button
                      className={`px-2 py-1 !rounded-full text-xs !font-semibold ${
                        row?.orderStatus === "delivered"
                          ? "!bg-green-100 !text-green-700"
                          : row?.orderStatus === "pending"
                          ? "!bg-yellow-100 !text-yellow-700"
                          : row?.orderStatus === "confirmed"
                          ? "!bg-blue-100 !text-blue-700"
                          : row?.orderStatus === "shipped"
                          ? "!bg-purple-100 !text-purple-700"
                          : "!bg-gray-100 !text-gray-700"
                      }`}
                      onClick={() => handleOpenStatusModal(row)}
                    >
                      {row?.orderStatus || "Order Status"}
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(row?.createdAt).toLocaleString() || "Date"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Product Modal */}
        <ViewOrderProductModal
          open={openModal}
          onClose={handleCloseModal}
          products={selectedProducts}
        />
        <UpdateOrderStatusModal
          open={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          order={selectedOrder}
          refetchOrders={() => fecthOrders(orderCurrentPage)}
        />
        ;
      </div>
      <div className="flex items-center justify-end pt-5 pb-5 px-4">
        <Pagination
          count={orderTotalPages}
          page={orderCurrentPage}
          onChange={handleOrderPageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default memo(AdminHomeRecentOrders);
