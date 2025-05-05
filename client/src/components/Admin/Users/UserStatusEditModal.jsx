import React, { useState, memo } from "react";
import { Modal, Box, Typography, Button, Tooltip } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import Select from "react-select";
import { useForm } from "react-hook-form";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useReduxHooks from "../../../hooks/useReduxHooks";

const UserStatusEditModal = ({ user, onUserUpdate }) => {
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { adminStatsActions, dispatch } = useReduxHooks();

  const [open, setOpen] = useState(false);

  const { handleSubmit, setValue } = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFormSubmit = async (data) => {
    if (!data.status) return showError("Please select a status");

    if (data.status === user?.status) return showError("No changes detected");

    const formattedData = {
      id: user?._id,
      status: data.status,
    };

    const response = await apiSubmit({
      url: apis().updateUserStatus.url,
      method: apis().updateUserStatus.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Updating User Status...",
    });

    if (response.success) {
      onUserUpdate();
      handleClose();
      dispatch(adminStatsActions.updateUsersDataChange(true));
    }
  };

  return (
    <>
      <Tooltip title={`Edit ${user?.name.split(" ")[0]}`} placement="top" arrow>
        <Button
          onClick={handleOpen}
          className="!w-9 hover:!text-primary !rounded-full !h-9 !min-w-9 bg-whitebg !border !border-[rgba(0,0,0,0.4)]"
        >
          <AiOutlineEdit className="text-base text-[rgba(0,0,0,0.7)]" />
        </Button>
      </Tooltip>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
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
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Edit User Status
          </Typography>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <p>
              Inactive users won't not be able to login to their account and
              placed any order or checkout. They won't be able to edit or view
              their profile.
            </p>
            <div className="mb-4">
              <h3 className="text-base font-medium mb-1">Status</h3>
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                defaultValue={{
                  value: user?.status,
                  label:
                    user?.status.charAt(0).toUpperCase() +
                    user?.status.slice(1),
                }}
                onChange={(selectedOption) =>
                  setValue("status", selectedOption.value)
                }
              />
            </div>

            {/* Buttons */}
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
                {loading ? "Updating..." : "Update"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default memo(UserStatusEditModal);
