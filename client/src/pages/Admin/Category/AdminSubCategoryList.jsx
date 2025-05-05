import React, { memo, useEffect, useState } from "react";
import useReduxHooks from "../../../hooks/useReduxHooks";
import Checkbox from "@mui/material/Checkbox";
import { Chip } from "@mui/material";
import { Button, Tooltip } from "@mui/material";
import { GoTrash } from "react-icons/go";
import { AdminAddProductButton } from "../../../components/Admin";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useProvideHooks from "../../../hooks/useProvideHooks";
import { SubCategoryEditModal } from "../../../components/Admin/";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const AdminSubCategoryList = () => {
  const { sidebar } = useReduxHooks();
  const { apis } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const isSidebarOpen = sidebar.isSidebarOpen;
  const tableHeadRow = ["Category Image", "Category", "Sub Category"];
  const [categories, setCategories] = useState([]);

  const handleDelete = async (categoryId, subCategoryId) => {
    const response = await apiSubmit({
      url: apis().deleteSubCategory.url,
      method: apis().deleteSubCategory.method,
      values: { categoryId, subCategoryId },
      showLoadingToast: true,
      loadingMessage: "Deleting sub category, please wait...",
    });

    if (response.success) {
      setCategories(
        categories.map((item) =>
          item._id === categoryId
            ? {
                ...item,
                subCategories: item.subCategories.filter(
                  (subCategory) => subCategory._id !== subCategoryId
                ),
              }
            : item
        )
      );
    }
  };

  const handleSubCategoryUpdate = (updatedSubCategory, categoryId) => {
    setCategories(
      categories.map((category) =>
        category._id === categoryId
          ? {
              ...category,
              subCategories: category.subCategories.map((subCategory) =>
                subCategory._id === updatedSubCategory._id
                  ? { ...subCategory, name: updatedSubCategory.name }
                  : subCategory
              ),
            }
          : category
      )
    );
  };

  useEffect(() => {
    const controller = new AbortController();

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
        <h2 className="text-lg font-semibold ">Sub Category List</h2>
        <AdminAddProductButton
          content="+ Add New Sub Category"
          src="/admin/sub-category-add"
        />
      </div>
      <p className="mt-3">
        Deleted Sub Category Products will be moved to its Parent category
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
              categories?.map((item) =>
                item?.name !== "Default Category" ? (
                  <tr
                    key={item._id}
                    className="odd:bg-white even:bg-gray-50 border-b"
                  >
                    {/* Product Info */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4 w-20">
                        <div className="img w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={item?.image?.url || "placeholder-image-url"}
                            className="w-full group-hover:scale-105 transition-all"
                            alt={item?.name || "Product"}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Category Name */}
                    <td className="px-6 py-3">{item.name}</td>

                    {/* Subcategories */}
                    <td className="px-6 py-3">
                      {item.subCategories && item.subCategories.length > 0 ? (
                        item.subCategories.map((subCategory) => (
                          <div
                            key={subCategory._id}
                            className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0"
                          >
                            {/* Subcategory Chip */}
                            <Chip
                              label={subCategory.name}
                              color="primary"
                              variant="outlined"
                              className="max-w-[60%]"
                            />

                            {/* Subcategory Actions */}
                            <div className="flex items-center gap-1 justify-end flex-wrap">
                              {/* Edit Subcategory */}
                              <SubCategoryEditModal
                                subCategory={subCategory}
                                categoryId={item._id}
                                onSubCategoryUpdate={handleSubCategoryUpdate}
                              />

                              {/* Delete Subcategory */}
                              <Tooltip
                                title={`Delete ${subCategory.name}`}
                                placement="top"
                                arrow
                              >
                                <Button
                                  className="!w-9 !h-9 !min-w-9 bg-gray-100 !rounded-full border border-gray-300 hover:bg-gray-200"
                                  onClick={() =>
                                    handleDelete(item._id, subCategory._id)
                                  }
                                  disabled={loading}
                                >
                                  <GoTrash className="text-gray-600" />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>No subcategories</span>
                      )}
                    </td>
                  </tr>
                ) : null
              )
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(AdminSubCategoryList);
