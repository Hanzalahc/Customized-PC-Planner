import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import useReduxHooks from "../../../hooks/useReduxHooks";
import { FileUpload } from "../../../components/";
import { Button } from "@mui/material";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useProvideHooks from "../../../hooks/useProvideHooks";

const AdminCategoryAdd = () => {
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { sidebar } = useReduxHooks();
  const isSidebarOpen = sidebar?.isSidebarOpen;
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    if (files.length === 0) {
      return showError("Category image is required");
    }

    const image = files[0];

    const formattedData = {
      name: data?.name.trim().replace(/\s+/g, " "),
      image: image,
    };

    const response = await apiSubmit({
      url: apis().addCategory.url,
      method: apis().addCategory.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Adding Category, please wait...",
    });

    if (response.success) {
      setFiles([]);
      reset();
    }
  };

  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      <section className="">
        <h1 className="text-lg font-semibold border-b border-[rgba(0,0,0,0.2)]  ">
          Add New Category
        </h1>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="form mt-5 mb-10  "
        >
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Upload Category Image (Just One)
              </h3>
              <FileUpload files={files} setFiles={setFiles} limit={1} />
            </div>
          </div>
          <div className=" grid grid-cols-1 mb-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Category Name</h3>
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
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? "Adding Category..." : "Add Category"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default memo(AdminCategoryAdd);
