import React, { useState, useEffect, useMemo } from "react";
import useApiSubmit from "../../../../hooks/useApiSubmit";
import useProvideHooks from "../../../../hooks/useProvideHooks";
import { Button } from "@mui/material";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { FileUpload, RTE } from "../../../";

const CoolerEditForm = () => {
  const { apis, showError, useParams } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { productId } = useParams();

  const [files, setFiles] = useState([]);
  const [productData, setProductData] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const calculateDiscount = useMemo(() => {
    return (price, oldPrice) => {
      if (!price || !oldPrice) return 0;
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    };
  }, []);

  const handleFormSubmit = async (data) => {
    if (files.length < 5) {
      return showError("5 Product images are required");
    }

    const images = files.map((file) => file);

   

    const formattedData = {
      name: data?.name.trim().replace(/\s+/g, " "),
      description: data?.description.trim().replace(/\s+/g, " "),
      content: data?.content,
      brand: data?.brand.trim().replace(/\s+/g, " "),
      price: parseInt(data?.price),
      oldPrice: parseInt(data?.oldPrice),
      discount: calculateDiscount(data?.price, data?.oldPrice),
      stock: parseInt(data?.stock),
      status: data?.status.value,
      isFeatured: data?.isFeatured.value,
      model: data?.model,
      powerCategory: data?.powerCategory.value,
      manufacturer: data?.manufacturer.value,
      weight: data?.weight,
      warranty: data?.warranty,
      socket: data?.socket.value,
      isWaterCooled: data?.isWaterCooled.value,
      isFanless: data?.isFanless.value,
      images: images,
    };

    const response = await apiSubmit({
      url: `${apis().updateCpu.url}${productId}`,
      method: apis().updateCpu.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Updating Product...",
    });

    if (response?.success) {
      setFiles([]);
      reset();
      setProductData({});
    }
  };

  const fetchProductData = async () => {
    const response = await apiSubmit({
      url: `${apis().getSingleProduct.url}${productId}`,
      method: apis().getSingleProduct.method,
      showLoadingToast: true,
      successMessage: null,
    });

    if (response?.success) {
      setProductData(response.data);
      setValue("name", response.data.name);
      setValue("description", response.data.description);
      setValue("brand", response.data.brand);
      setValue("price", response.data.price);
      setValue("oldPrice", response.data.oldPrice);
      setValue("stock", response.data.stock);
      setValue("content", response.data.content);
      setValue("model", response.data.model);
      setValue("warranty", response.data.warranty);
      setValue("weight", response.data.weight);
      setValue(
        "status",
        response.data.status
          ? { value: "active", label: "Active" }
          : { value: "inactive", label: "Inactive" }
      );
      setValue(
        "isFeatured",
        response.data.isFeatured
          ? { value: true, label: "Yes" }
          : { value: false, label: "No" }
      );
      setValue(
        "powerCategory",
        response.data.powerCategory
          ? {
              value: response.data.powerCategory,
              label: response.data.powerCategory,
            }
          : null
      );
      setValue(
        "manufacturer",
        response.data.manufacturer
          ? { value: response.data.manufacturer, label: response.data.manufacturer }
          : null
      )

      setValue(
        "socket",
        response.data.socket
          ? { value: response.data.socket, label: response.data.socket }
          : null
      );

      setValue(
        "isWaterCooled",
        response.data.isWaterCooled
          ? { value: true, label: "Yes" }
          : { value: false, label: "No" }
      );

      setValue(
        "isFanless",
        response.data.isFanless
          ? { value: true, label: "Yes" }
          : { value: false, label: "No" }
      );

    
      setFiles(response.data.images);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchProductData();
  }, []);
  return (
     <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="form mt-5 mb-10  "
        >
          <div className=" grid grid-cols-1">
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Upload 5 Product Images *
              </h3>
              <FileUpload files={files} setFiles={setFiles} limit={5} />
            </div>
          </div>
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Name *</h3>
              <input
                type="text"
                placeholder="Enter product title here min 40 characters max 90 characters"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("name", {
                  required: true,
                  minLength: {
                    value: 40,
                    message: "Category name must be at least 40 characters long",
                  },
                  maxLength: {
                    value: 90,
                    message: "Category name must not exceed 90 characters",
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
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Description *</h3>
              <textarea
                type="text"
                placeholder="Enter product description here min 40 characters max 1000 characters"
                className="w-full h-36 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("description", {
                  required: true,
                  minLength: {
                    value: 40,
                    message:
                      "Product description must be at least 40 characters long",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Product description must not exceed 1000 characters",
                  },
                })}
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Product Deatiled Description *
              </h3>
              <RTE
                label="min 40 max 10000 characters"
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
              {errors.content && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-2 mb-3 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Model *</h3>
              <input
                type="text"
                placeholder="AMD Ryzen 5 5600X min 3 characters max 30 characters"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("model", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "model name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 40,
                    message: "model name must not exceed 40 characters",
                  },
                })}
              />
              {errors.model && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.model.message}
                </span>
              )}
            </div>
    
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Brand *</h3>
              <input
                type="text"
                placeholder="AMD Ryzen min 3 characters max 30 characters"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("brand", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "Brand name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 30,
                    message: "Brand name must not exceed 30 characters",
                  },
                })}
              />
              {errors.brand && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.brand.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-3 mb-3 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Old Price *</h3>
              <input
                type="number"
                placeholder="10000 "
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                step={0.01}
                {...register("oldPrice", {
                  required: true,
                  min: {
                    value: 0,
                    message: "Old price must be greater than 0",
                  },
                })}
              />
              {errors.oldPrice && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.oldPrice.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Price *</h3>
              <input
                type="number"
                placeholder="9000"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                step={0.01}
                {...register("price", {
                  required: true,
                  min: {
                    value: 0,
                    message: "Price must be greater than 0",
                  },
                })}
              />
              {errors.price && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>
    
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Stock *</h3>
              <input
                type="number"
                placeholder="100"
                step={1}
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("stock", {
                  required: true,
                  min: {
                    value: 0,
                    message: "Stock must be greater than 0",
                  },
                })}
              />
              {errors.stock && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-2 mb-3 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Is Featured * </h3>
              <Controller
                name="isFeatured"
                control={control}
                rules={{ required: "Featured status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                )}
              />
    
              {errors.isFeatured && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.isFeatured.message}
                </span>
              )}
            </div>
    
            <div className="col">
              <h3 className="text-base font-medium mb-1">Power Category * </h3>
              <Controller
                name="powerCategory"
                control={control}
                rules={{ required: "Power category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    placeholder="1 for low tier and 10 for high tier"
                    classNamePrefix="select"
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                )}
              />
              {errors.powerCategory && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.powerCategory.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-4 mb-5 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product weight</h3>
              <input
                type="text"
                placeholder="1 Kg min 3 characters max 20 characters"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("weight", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "Warranty must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Warranty must not exceed 20 characters",
                  },
                })}
              />
              {errors.weight && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.weight.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product warranty * </h3>
              <input
                type="text"
                placeholder="12 months min 3 characters max 20 characters"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("warranty", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "Warranty must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Warranty must not exceed 20 characters",
                  },
                })}
              />
              {errors.warranty && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.warranty.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1"> isWaterCooled * </h3>
              <Controller
                name="isWaterCooled"
                control={control}
                rules={{ required: "isWaterCooled is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" },
                    ]}
                  />
                )}
              />
    
              {errors.isWaterCooled && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.isWaterCooled.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1"> isFanless * </h3>
              <Controller
                name="isFanless"
                control={control}
                rules={{ required: "isFanless is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" },
                    ]}
                  />
                )}
              />
    
              {errors.isFanless && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.isFanless.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-2 mb-5 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">socket * </h3>
              <Controller
                name="socket"
                control={control}
                rules={{ required: "socket is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    placeholder="Select socket type"
                    classNamePrefix="select"
                    options={[
                      "AM1",
                      "AM2",
                      "AM3",
                      "AM4",
                      "AM5",
                      "LGA 775",
                      "LGA 1150",
                      "LGA 1151",
                      "LGA 1155",
                      "LGA 1156",
                      "LGA 1200",
                      "LGA 1366",
                      "LGA 1700",
                      "LGA 1851",
                      "LGA 2011",
                      "LGA 2066",
                    ].map((item) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                )}
              />
    
              {errors.socket && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.socket.message}
                </span>
              )}
            </div>
    
            <div className="col">
              <h3 className="text-base font-medium mb-1">manufacturer * </h3>
              <Controller
                name="manufacturer"
                control={control}
                rules={{ required: "manufacturer is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={[
                      "ADATA",
                      "Aerocool",
                      "AMD",
                      "Deepcool",
                      "Darkflash",
                      "EVGA",
                      "Evercool",
                      "Gigabyte",
                      "Intel",
                      "Cooler Master",
                      "Lian Li",
                      "Razer",
                      "Sapphire",
                      "SilverX",
                      "Silverstone",
                      "Thermaltake",
                      "Ball",
                      "Fluid Dynamic",
                      "Rifle",
                      "Noctua",
                      "Sleeve",
                      "Aigo",
                    ].map((item) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                )}
              />
    
              {errors.manufacturer && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.manufacturer.message}
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
            {loading ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
  );
};

export default CoolerEditForm
