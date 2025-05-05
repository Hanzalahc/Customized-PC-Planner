import React, { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const ViewOrderProductModal = ({ open, onClose, products }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Order Products</DialogTitle>
      <DialogContent dividers>
        {products.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={
                          item?.productId?.images?.[0].url || "placeholder.jpg"
                        }
                        alt={item?.productId?.name}
                        width="50"
                        height="50"
                        style={{ borderRadius: "5px" }}
                      />
                    </TableCell>
                    <TableCell>{item?.productId?.name || "N/A"}</TableCell>
                    <TableCell>{item?.productId?.brand || "N/A"}</TableCell>
                    <TableCell>{item?.productId?.price} PKR</TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No products found for this order.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ViewOrderProductModal);
