import React, { useState, useEffect, useMemo } from "react";
import useApiSubmit from "../../../../hooks/useApiSubmit";
import useProvideHooks from "../../../../hooks/useProvideHooks";
import { Button } from "@mui/material";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { FileUpload, RTE } from "../../../";

const GpuEditForm = () => {
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

    const areImagesSame = productData.images
      .map((img) => img.publicId)
      .sort()
      .every(
        (publicId, index) =>
          publicId === images.map((img) => img.publicId).sort()[index]
      );

    if (
      productData.name === data.name.trim().replace(/\s+/g, " ") &&
      productData.description ===
        data.description.trim().replace(/\s+/g, " ") &&
      data.content === productData.content &&
      productData.brand === data.brand.trim().replace(/\s+/g, " ") &&
      productData.price === parseInt(data.price) &&
      productData.oldPrice === parseInt(data.oldPrice) &&
      productData.stock === parseInt(data.stock) &&
      productData.status === data.status.value &&
      productData.isFeatured === data.isFeatured.value &&
      productData.model === data.model &&
      productData.powerCategory === data.powerCategory.value &&
      productData.weight === data.weight &&
      productData.warranty === data.warranty &&
      productData.vRam === parseInt(data.vRam) &&
      productData.benchmark === parseInt(data.benchmark) &&
      productData.tdp === parseInt(data.tdp) &&
      productData.hdmiPorts === parseInt(data.hdmiPorts) &&
      productData.displayPorts === parseInt(data.displayPorts) &&
      productData.dviPorts === parseInt(data.dviPorts) &&
      productData.memoryInterface === data.memoryInterface.value &&
      productData.memoryType === data.memoryType.value &&
      productData.interfaceType === data.interfaceType.value &&
      productData.manufacturer === data.manufacturer.value &&
      areImagesSame
    ) {
      return showError("No changes detected");
    }

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
      model: data?.model.trim().replace(/\s+/g, " "),
      powerCategory: data?.powerCategory.value,
      weight: data?.weight.trim().replace(/\s+/g, " "),
      warranty: data?.warranty.trim().replace(/\s+/g, " "),
      vRam: parseInt(data?.vRam),
      benchmark: parseInt(data?.benchmark),
      tdp: parseInt(data?.tdp),
      hdmiPorts: parseInt(data?.hdmiPorts),
      displayPorts: parseInt(data?.displayPorts),
      dviPorts: parseInt(data?.dviPorts),
      memoryInterface: data?.memoryInterface.value,
      memoryType: data?.memoryType.value,
      interfaceType: data?.interfaceType.value,
      manufacturer: data?.manufacturer.value,
      images: images,
    };

    const response = await apiSubmit({
      url: `${apis().updateGpu.url}${productId}`,
      method: apis().updateGpu.method,
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
      setValue("vRam", response.data.vRam);
      setValue(
        "memoryType",
        response.data.memoryType
          ? { value: response.data.memoryType, label: response.data.memoryType }
          : null
      );
      setValue(
        "interfaceType",
        response.data.interfaceType
          ? {
              value: response.data.interfaceType,
              label: response.data.interfaceType,
            }
          : null
      );
      setValue("tdp", response.data.tdp);
      setValue("hdmiPorts", response.data.hdmiPorts);
      setValue("displayPorts", response.data.displayPorts);
      setValue("dviPorts", response.data.dviPorts);
      setValue(
        "memoryInterface",
        response.data.memoryInterface
          ? {
              value: response.data.memoryInterface,
              label: response.data.memoryInterface,
            }
          : null
      );

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
          ? {
              value: response.data.manufacturer,
              label: response.data.manufacturer,
            }
          : null
      );
      setValue("benchmark", response.data.benchmark);
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
          <p className="text-sm text-gray-500 mb-3">
            If you want to update the images, please upload new images.
            Otherwise leave it as it is.
          </p>
          <FileUpload files={files} setFiles={setFiles} limit={5} />
        </div>
      </div>
      <div className=" grid grid-cols-1 mb-3">
        <div className="col">
          <h3 className="text-base font-medium mb-1">Product Name *</h3>
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
                value: 100,
                message: "Category name must not exceed 100 characters",
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
            className="w-full h-36 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("description", {
              required: true,
              minLength: {
                value: 3,
                message:
                  "Product description must be at least 3 characters long",
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
            label="Content :"
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
      <div className=" grid grid-cols-3 mb-3 gap-5">
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
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
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
          <h3 className="text-base font-medium mb-1">Status * </h3>
          <Controller
            name="status"
            control={control}
            rules={{ required: "status is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                classNamePrefix="select"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
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
          <h3 className="text-base font-medium mb-1">Product vRam * </h3>
          <input
            type="number"
            placeholder="8"
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("vRam", {
              required: true,
              min: {
                value: 1,
                message: "vRam must be greater than 0",
              },
            })}
          />
          {errors.vRam && (
            <span className="text-red-500 text-sm mt-1">
              {errors.vRam.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">memoryInterface * </h3>
          <Controller
            name="memoryInterface"
            control={control}
            rules={{ required: "memoryInterface is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select memoryInterface"
                classNamePrefix="select"
                options={[128, 192, 256].map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            )}
          />

          {errors.memoryInterface && (
            <span className="text-red-500 text-sm mt-1">
              {errors.memoryInterface.message}
            </span>
          )}
        </div>
      </div>
      <div className=" grid grid-cols-4 mb-5 gap-5">
        <div className="col">
          <h3 className="text-base font-medium mb-1">memoryType * </h3>
          <Controller
            name="memoryType"
            control={control}
            rules={{ required: "memoryType is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={[
                  "DDR4",
                  "DDR5",
                  "GDDR5",
                  "GDDR5X",
                  "GDDR6",
                  "GDDR6X",
                ].map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            )}
          />

          {errors.memoryType && (
            <span className="text-red-500 text-sm mt-1">
              {errors.memoryType.message}
            </span>
          )}
        </div>

        <div className="col">
          <h3 className="text-base font-medium mb-1">interfaceType * </h3>
          <Controller
            name="interfaceType"
            control={control}
            rules={{ required: "interfaceType is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                classNamePrefix="select"
                options={["PCI", "PCIE X1", "PCIE X8", "PCIE X16", "AGP"].map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
              />
            )}
          />

          {errors.interfaceType && (
            <span className="text-red-500 text-sm mt-1">
              {errors.interfaceType.message}
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
                  "Asus",
                  "MSI",
                  "Evga",
                  "Gigabyte",
                  "Asrock",
                  "Colorful",
                  "Sapphire",
                  "Nvidia",
                  "Galaxy",
                  "Zotac",
                  "PowerColor",
                  "Palit",
                  "XFX",
                  "Inno3D",
                  "PNY",
                  "VisionTek",
                  "Gainward",
                  "Leadtek",
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
          <h3 className="text-base font-medium mb-1">Product benchmark *</h3>
          <input
            type="number"
            placeholder="1500"
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("benchmark", {
              required: true,
              min: {
                value: 0,
                message: "Benchmark must be greater than 0",
              },
            })}
          />
          {errors.benchmark && (
            <span className="text-red-500 text-sm mt-1">
              {errors.benchmark.message}
            </span>
          )}
        </div>
      </div>
      <div className=" grid grid-cols-4 mb-5 gap-5">
        <div className="col">
          <h3 className="text-base font-medium mb-1">Product tdp *</h3>
          <input
            type="number"
            placeholder="min 15 max 580"
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("tdp", {
              required: true,
              min: {
                value: 15,
                message: "tdp must be greater than 15",
              },
              max: {
                value: 580,
                message: "tdp must be less than 580",
              },
            })}
          />
          {errors.tdp && (
            <span className="text-red-500 text-sm mt-1">
              {errors.tdp.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">Product hdmiPorts *</h3>
          <input
            type="number"
            placeholder="min 1 "
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("hdmiPorts", {
              required: true,
              min: {
                value: 1,
                message: "coreCount must be greater than 0",
              },
            })}
          />
          {errors.hdmiPorts && (
            <span className="text-red-500 text-sm mt-1">
              {errors.hdmiPorts.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">
            Product displayPorts *{" "}
          </h3>
          <input
            type="number"
            placeholder="min 1"
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("displayPorts", {
              required: true,
              min: {
                value: 1,
                message: "displayPorts must be greater than 0",
              },
            })}
          />
          {errors.displayPorts && (
            <span className="text-red-500 text-sm mt-1">
              {errors.displayPorts.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">Product dviPorts *</h3>
          <input
            type="number"
            placeholder="min 1"
            step={1}
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            {...register("dviPorts", {
              min: {
                value: 1,
                message: "dviPorts must be greater than 0",
              },
            })}
          />
          {errors.dviPorts && (
            <span className="text-red-500 text-sm mt-1">
              {errors.dviPorts.message}
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
        {loading ? "Updating Product..." : "Update Product"}
      </Button>
    </form>
  );
};

export default GpuEditForm;
