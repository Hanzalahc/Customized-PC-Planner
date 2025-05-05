import React, { memo, useEffect, useState } from "react";
import useReduxHooks from "../../../hooks/useReduxHooks";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";

import { GoTrash } from "react-icons/go";
import { AdminAddProductButton } from "../../../components/Admin";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import { CategoryEditModal } from "../../../components/Admin/";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const AdminCategoryList = () => {
  const { sidebar } = useReduxHooks();
  const { apis } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const isSidebarOpen = sidebar.isSidebarOpen;
  const tableHeadRow = ["Image", "title", "Action"];
  const [categories, setCategories] = useState([]);

  const handleDelete = async (id) => {
    const response = await apiSubmit({
      url: apis().deleteCategory.url,
      method: apis().deleteCategory.method,
      values: { id },
      showLoadingToast: true,
      loadingMessage: "Deleting category, please wait...",
    });

    if (response.success) {
      setCategories(categories.filter((item) => item._id !== id));
    }
  };

  const fetchCategories = async () => {
    const response = await apiSubmit({
      url: apis().getAllCategories.url,
      method: apis().getAllCategories.method,
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setCategories(response.data);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(0,0,0,0.2)]">
        <h2 className="text-lg font-semibold ">Category List</h2>
        <AdminAddProductButton
          content="+ Add New Category"
          src="/admin/category-add"
        />
      </div>
      <p className="mt-3">
        Deleted Category Products will be moved to the "Default" category and
        all its sub categories will be deleted.
      </p>
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
            {categories?.length !== 0 ? (
              categories?.map((item) => (
                <tr
                  key={item._id}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  {/* Product Info */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4 w-20">
                      <div className="img w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={item?.image?.url}
                          className="w-full group-hover:scale-105 transition-all"
                          alt={item?.name}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3">{item?.name}</td>

                  {/* Actions */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      {item?.name !== "Default Category" && (
                        <>
                          <CategoryEditModal
                            category={item}
                            onCategoryUpdate={fetchCategories}
                          />
                          <Tooltip title="Delete" placement="top" arrow>
                            <Button
                              onClick={() => {
                                handleDelete(item?._id);
                              }}
                              disabled={loading}
                              className="!w-9 hover:!text-primary !rounded-full !h-9 !min-w-9 bg-whitebg !border !border-[rgba(0,0,0,0.4)]"
                            >
                              <GoTrash className="text-base text-[rgba(0,0,0,0.7)]" />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-5">
                  No category found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(AdminCategoryList);
