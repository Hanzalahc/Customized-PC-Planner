import React, { memo, useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { FileUpload, RTE } from "../../../index";
import { Button } from "@mui/material";
import useProvideHooks from "../../../../hooks/useProvideHooks";
import useApiSubmit from "../../../../hooks/useApiSubmit";
// import useReduxHooks from "../../../../hooks/useReduxHooks";

const RamAddForm = ({productType}) => {
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();

  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
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
      model: data?.model.trim().replace(/\s+/g, " "),
      warranty: data?.warranty.trim().replace(/\s+/g, " "),
      name: data?.name.trim().replace(/\s+/g, " "),
      description: data?.description.trim().replace(/\s+/g, " "),
      weight: data?.weight.trim().replace(/\s+/g, " "),
      content: data?.content,
      brand: data?.brand.trim().replace(/\s+/g, " "),
      price: parseInt(data?.price),
      oldPrice: parseInt(data?.oldPrice),
      discount: calculateDiscount(data?.price, data?.oldPrice),
      stock: parseInt(data?.stock),
      isFeatured: data?.isFeatured.value === "true" ? true : false,
      powerCategory: parseInt(data?.powerCategory.value),
      productType: productType,
      manufacturer: data?.manufacturer.value,
      module: parseInt(data?.module),
      ramSize: parseInt(data?.ramSize),
      ramType: data?.ramType.value,
      latency: parseInt(data?.latency),
      cacheLatency: parseInt(data?.cacheLatency),
      module: data?.module,
      images: images,
    };

    const response = await apiSubmit({
      url: apis().ramAdd.url,
      method: apis().ramAdd.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Adding Product, please wait...",
    });

    if (response?.success) {
      setFiles([]);
      reset();
    }
  };

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
          <h3 className="text-base font-medium mb-1">Product ramSize * </h3>
          <input
            type="number"
            placeholder="min 1 max 256"
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("ramSize", {
              required: true,
              min: {
                value: 1,
                message: "ramSize must be greater than 0",
              },
              max: {
                value: 256,
                message: "ramSize must not be greater than 256",
              },
            })}
          />
          {errors.ramSize && (
            <span className="text-red-500 text-sm mt-1">
              {errors.ramSize.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">ramType * </h3>
          <Controller
            name="ramType"
            control={control}
            rules={{ required: "ramType is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select ramType"
                classNamePrefix="select"
                options={["DDR2", "DDR3", "DDR4", "DDR5"].map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            )}
          />

          {errors.ramType && (
            <span className="text-red-500 text-sm mt-1">
              {errors.ramType.message}
            </span>
          )}
        </div>
      </div>
      <div className=" grid grid-cols-4 mb-5 gap-5">
        <div className="col">
          <h3 className="text-base font-medium mb-1">Product latency * </h3>
          <input
            type="number"
            placeholder="min 6 "
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("latency", {
              required: true,
              min: {
                value: 6,
                message: "latency must be greater than 5",
              },
            })}
          />
          {errors.latency && (
            <span className="text-red-500 text-sm mt-1">
              {errors.latency.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">
            Product cacheLatency *{" "}
          </h3>
          <input
            type="number"
            placeholder="min 1 max 52"
            step={0.5}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("cacheLatency", {
              required: true,
              min: {
                value: 2.5,
                message: "cacheLatency must be greater or equal 2.5",
              },
              max: {
                value: 52,
                message: "cacheLatency must not be greater than 52",
              },
            })}
          />
          {errors.cacheLatency && (
            <span className="text-red-500 text-sm mt-1">
              {errors.cacheLatency.message}
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
                  "Acer",
                  "ADATA",
                  "AMD",
                  "Antec",
                  "Corsair",
                  "EVGA",
                  "G.Skill",
                  "Gigabyte",
                  "Kingston",
                  "Lexar",
                  "Samsung",
                  "V-Color",
                  "XPG",
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

        <div className="col">
          <h3 className="text-base font-medium mb-1">Product module *</h3>
          <input
            type="text"
            placeholder="single or double"
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("module", {
              required: true,
            })}
          />
          {errors.module && (
            <span className="text-red-500 text-sm mt-1">
              {errors.module.message}
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

export default RamAddForm;
