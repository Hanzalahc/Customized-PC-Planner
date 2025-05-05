import React, { memo, useEffect, useState } from "react";
import useReduxHooks from "../../../hooks/useReduxHooks";
import { Select, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";

const AdminSubCategoryAdd = () => {
  const { sidebar } = useReduxHooks();
  const { apis } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const isSidebarOpen = sidebar.isSidebarOpen;
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    const formattedData = {
      name: data?.name.trim().replace(/\s+/g, " "),
      categoryId: data?.categoryId,
    };

    const response = await apiSubmit({
      url: apis().addSubCategory.url,
      method: apis().addSubCategory.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Adding Sub Category, please wait...",
    });

    if (response.success) {
      reset();
    }
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
      <section className="">
        <h1 className="text-lg font-semibold border-b border-[rgba(0,0,0,0.2)]  ">
          Add New Sub Category
        </h1>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="form mt-5 mb-10  "
        >
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Sub Category Name</h3>
              <input
                type="text"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("name", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "Category name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 30,
                    message: "Category name must not exceed 30 characters",
                  },
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-1 mb-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1"> Category</h3>
              <Select
                className="w-full !text-sm !font-medium  "
                size="small"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Category"
                {...register("categoryId", { required: true })}
              >
                {categories
                  .filter((category) => category.name !== "Default Category")
                  .map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.categoryId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.categoryId.message}
                </span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? "Adding Sub Category..." : "Add Sub Category"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default memo(AdminSubCategoryAdd);
