import { toast, Toaster } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, Rating, TextField } from "@mui/material";
import {
  useNavigate,
  Link,
  NavLink,
  useLocation,
  useParams,
  Outlet,
} from "react-router-dom";
import apis from "../api/api";

const useProvideHooks = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const showSuccess = (message) =>
    toast.success(message || "Operation successful!");
  const showError = (message) =>
    toast.error(message || "Something went wrong!");
  const showLoading = (message) => toast.loading(message || "Processing...");

  const showName = (message) => {
    {
      toast.success(`Welcome, ${message}!`, {
        duration: 3000,
        position: "top-right",
        style: {
          border: "1px solid #00e676",
          padding: "20px",
          color: "#fff",
          background: "linear-gradient(45deg, #00e676, #1de9b6)",
          fontWeight: "600",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          fontSize: "16px",
        },
        iconTheme: {
          primary: "#00e676",
          secondary: "#fff",
        },
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
    }
  };

  const customSuccessToast = (message) =>
    toast.success(message || "Operation successful!", {
      style: {
        border: "1px solid #4CAF50",
        padding: "16px",
        color: "#fff",
        backgroundColor: "#4CAF50",
        borderRadius: "8px",
        fontWeight: "bold",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#4CAF50",
      },
    });

  const customErrorToast = (message) =>
    toast.error(message || "Something went wrong!", {
      style: {
        border: "1px solid #F44336",
        padding: "16px",
        color: "#fff",
        backgroundColor: "#F44336",
        borderRadius: "8px",
        fontWeight: "bold",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#F44336",
      },
    });

  const customLoadingToast = (message) =>
    toast.loading(message || "Processing...", {
      style: {
        border: "1px solid #2196F3",
        padding: "16px",
        color: "#fff",
        backgroundColor: "#2196F3",
        borderRadius: "8px",
        fontWeight: "bold",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#2196F3",
      },
    });

  return {
    apis,
    useEffect,
    useRef,
    useState,
    loading,
    setLoading,
    Yup,
    Form,
    Formik,
    navigate,
    useParams,
    Link,
    NavLink,
    location,
    Outlet,
    Toaster,
    showSuccess,
    showError,
    showName,
    showLoading,
    customSuccessToast,
    customErrorToast,
    customLoadingToast,
    Button,
    Rating,
    TextField,
  };
};

export default useProvideHooks;
