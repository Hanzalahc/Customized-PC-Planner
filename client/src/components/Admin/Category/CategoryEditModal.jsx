import React, { useState, memo, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { useForm } from "react-hook-form";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import { FileUpload } from "../../";

const CategoryEditModal = ({ category, onCategoryUpdate }) => {
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();

  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const controller = new AbortController();
    setValue("name", category?.name);
    setFiles([category?.image]);

    return () => {
      controller.abort();
    };
  }, [category, setValue]);

  const handleFormSubmit = async (data) => {
    if (files.length === 0) {
      return showError("Category image is required");
    }

    let imageData = files[0];

    if (
      data?.name.trim().replace(/\s+/g, " ") === category?.name &&
      imageData.publicId === category?.image?.publicId
    ) {
      return showError("Nothing to update");
    }

    const formattedData = {
      name: data?.name.trim().replace(/\s+/g, " "),
      image: imageData,
      id: category?._id,
    };

    const responce = await apiSubmit({
      url: apis().updateCategory.url,
      method: apis().updateCategory.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Updating Category, please wait...",
    });

    if (responce.success) {
      onCategoryUpdate();
      reset();
      handleClose();
      setFiles([]);
    }
  };

  return (
    <>
      <Tooltip title="Edit" placement="top" arrow>
        <Button
          onClick={handleOpen}
          className="!w-9 hover:!text-primary !rounded-full !h-9 !min-w-9 bg-whitebg !border !border-[rgba(0,0,0,0.4)]"
        >
          <AiOutlineEdit className="text-base text-[rgba(0,0,0,0.7)]" />
        </Button>
      </Tooltip>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="category-modal-title"
        aria-describedby="category-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="category-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Edit Category
          </Typography>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Category Name */}
            <div className=" grid grid-cols-1 mb-3">
              <div className="col">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  If you want to update the image, please upload a new image.
                  Otherwise leave it as it is.
                </span>
                <FileUpload files={files} setFiles={setFiles} limit={1} />
              </div>
            </div>

            {/* Category Image */}
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
                      message:
                        "Category name must be at least 3 characters long",
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

            {/* Submit and Cancel Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button onClick={handleClose} color="warning" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                color="primary"
              >
                {loading ? "Updating Category..." : "Update Category"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default memo(CategoryEditModal);
