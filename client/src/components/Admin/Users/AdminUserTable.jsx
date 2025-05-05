import React, { memo, useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import Select from "react-select";
import Pagination from "@mui/material/Pagination";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import { UserStatusEditModal } from "../";
import avatar from "../../../assets/avatar.png";

const AdminUserTable = () => {
  const { apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();

  const [usersData, setUsersData] = useState([]);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const tableHeadRow = [
    "Image",
    "Name",
    "Email",
    "Phone No",
    "Email Verified",
    "Reviews Count",
    "Status",
    "Created At",
    "Action",
  ];

  const fecthUsers = async (page) => {
    const response = await apiSubmit({
      url: `${apis().getAllUsers.url}`,
      method: apis().getAllUsers.method,
      query: { pageNum: page },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setUserTotalPages(response.totalPages);
      setUsersData(response.data);
    }
  };

  const handleUserPageChange = (event, page) => {
    setUserCurrentPage(page);
    fecthUsers(page);
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersData;

    return usersData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.mobile && user.mobile.includes(searchQuery))
    );
  }, [usersData, searchQuery]);

  const handleStatusFilter = async (status) => {
    if (!status) {
      fecthUsers(userCurrentPage);
      return;
    }

    const response = await apiSubmit({
      url: `${apis().getUsersByFilters.url}`,
      method: apis().getUsersByFilters.method,
      query: { pageNum: userCurrentPage, status },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setUsersData(response.data);
      setUserTotalPages(response.totalPages);
    } else {
      fecthUsers(userCurrentPage);
    }
  };

  const handleEmailVerifiedFilter = async (email) => {
    if (!email) {
      fecthUsers(userCurrentPage);
      return;
    }

    const response = await apiSubmit({
      url: `${apis().getUsersByFilters.url}`,
      method: apis().getUsersByFilters.method,
      query: { pageNum: userCurrentPage, emailVerified: email },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setUsersData(response.data);
      setUserTotalPages(response.totalPages);
    } else {
      fecthUsers(userCurrentPage);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fecthUsers(userCurrentPage);
  }, []);

  return (
    <>
      <div className="card my-4 bg-white tablet:rounded-lg shadow-md ">
        <div className="flex items-center justify-between px-5 py-5">
          <h3 className="text-lg font-semibold">
            Users List ({usersData.length})
          </h3>
        </div>
        <div className="flex items-end  w-full px-5  gap-5">
          <div className="col w-[20%]">
            <h4 className="font-semibold text-sm mb-2">Filter By Status</h4>
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
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ] || []
              }
              onChange={(e) => {
                handleStatusFilter(e.value);
              }}
            />
          </div>

          <div className="col w-[20%]">
            <h4 className="font-semibold text-sm mb-2">
              Filter By Email Verified
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
          </div>

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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr
                    key={item?._id}
                    className="odd:bg-white even:bg-gray-50 border-b"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4 w-20">
                        <div className="img w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={item?.avatar?.url || avatar}
                            className="w-full group-hover:scale-105 transition-all"
                            alt={item?.name}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">{item?.name || "No Name"}</td>
                    <td className="px-6 py-3">{item?.email || "No Email"}</td>
                    <td className="px-6 py-3">{item?.mobile || "No Mobile"}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs text-white px-2 py-1 rounded-md ${
                          item?.emailVerified === true
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {item?.emailVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-3">{item?.reviews.length || 0}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs text-white px-2 py-1 rounded-md ${
                          item.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {item?.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {new Date(item?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        <UserStatusEditModal
                          user={item}
                          onUserUpdate={fecthUsers}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeadRow.length} className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end pt-5 pb-5 px-4">
          <Pagination
            count={userTotalPages}
            page={userCurrentPage}
            onChange={handleUserPageChange}
            color="primary"
          />
        </div>
      </div>
    </>
  );
};

export default memo(AdminUserTable);
