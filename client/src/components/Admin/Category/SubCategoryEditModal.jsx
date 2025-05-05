import React, { useState, memo } from "react";
import { Button, Modal, TextField, Tooltip } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { useForm } from "react-hook-form";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";

const SubCategoryEditModal = ({
  subCategory,
  categoryId,
  onSubCategoryUpdate,
}) => {
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    if (data?.name.trim().replace(/\s+/g, " ") === subCategory?.name) {
      return showError("Nothing to update");
    }

    const formattedName = data.name.trim().replace(/\s+/g, " ");

    const response = await apiSubmit({
      url: apis().updateSubCategory.url,
      method: apis().updateSubCategory.method,
      values: {
        name: formattedName,
        categoryId,
        subCategoryId: subCategory._id,
      },
      showLoadingToast: true,
      loadingMessage: "Updating subcategory, please wait...",
    });

    if (response.success) {
      onSubCategoryUpdate(response.data, categoryId);
      handleClose();
    }
  };

  return (
    <>
      <Tooltip title={`Edit ${subCategory.name}`} placement="top" arrow>
        <Button
          className="!w-9 !h-9 !min-w-9 bg-gray-100 !rounded-full border border-gray-300 hover:bg-gray-200"
          onClick={handleOpen}
        >
          <AiOutlineEdit className="text-gray-600" />
        </Button>
      </Tooltip>

      {/* MUI Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-subcategory-modal"
      >
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-5 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <TextField
                  label="Subcategory Name"
                  fullWidth
                  defaultValue={subCategory.name}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 30,
                      message: "Name must not exceed 30 characters",
                    },
                  })}
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(SubCategoryEditModal);
