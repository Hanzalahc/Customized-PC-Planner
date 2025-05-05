import React, { useState, memo } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Select from "react-select";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useReduxHooks from "../../../hooks/useReduxHooks";

const UpdateOrderStatusModal = ({ open, onClose, order, refetchOrders }) => {
  const { apiSubmit, loading } = useApiSubmit();
  const { apis, showError } = useProvideHooks();
  const { adminStatsActions, dispatch } = useReduxHooks();

  const [newStatus, setNewStatus] = useState(order?.orderStatus || "");

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order.orderStatus) {
      showError("No changes detected");
      return;
    }

    const formattedData = {
      id: order?._id,
      status: newStatus,
    };

    const response = await apiSubmit({
      url: apis().updateOrderStatus.url,
      method: apis().updateOrderStatus.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Updating Order Status...",
    });

    if (response.success) {
      refetchOrders();
      onClose();
      dispatch(adminStatsActions.updateOrdersDataChange(true));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Update Order Status</Typography>
        <Select
          fullWidth
          defaultValue={{
            value: order?.orderStatus,
            label: order?.orderStatus,
          }}
          options={
            order?.orderStatus === "pending"
              ? [
                  { value: "confirmed", label: "Confirmed" },
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                ]
              : order?.orderStatus === "confirmed"
              ? [
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                ]
              : order?.orderStatus === "shipped"
              ? [{ value: "delivered", label: "Delivered" }]
              : []
          }
          onChange={(selectedOption) => setNewStatus(selectedOption.value)}
          sx={{ mt: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            onClick={handleUpdateStatus}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateOrderStatusModal;
