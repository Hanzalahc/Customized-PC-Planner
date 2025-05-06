import React, { useState, useEffect, useMemo } from "react";
import useApiSubmit from "../../../../hooks/useApiSubmit";
import useProvideHooks from "../../../../hooks/useProvideHooks";
import Select from "react-select";
import { FileUpload, RTE } from "../../../";
import { useForm, Controller } from "react-hook-form";
import { Button, Modal, TextField } from "@mui/material";

const PrebuildEditForm = () => {
  const { apis, showError, useParams } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { productId } = useParams();

  const [productData, setProductData] = useState({});
  const [files, setFiles] = useState([]);
  const [cpuData, setCpuData] = useState([]);
  const [gpuData, setGpuData] = useState([]);
  const [ramData, setRamData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [psuData, setPsuData] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [coolerData, setCoolerData] = useState([]);
  const [motherboardData, setMotherboardData] = useState([]);
  const [hasUpgradeOptions, setHasUpgradeOptions] = useState(false);
  const [open, setOpen] = useState(false);
  const [upgradeData, setUpgradeData] = useState([]);
  const [newUpgrade, setNewUpgrade] = useState({
    upgradeName: "",
    additionalPrice: "",
  });
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [productType, setProductType] = useState("Prebuild");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleAddUpgrade = () => {
    if (newUpgrade.upgradeName && newUpgrade.additionalPrice) {
      setUpgradeData([...upgradeData, newUpgrade]);
      setNewUpgrade({
        upgradeName: "",
        additionalPrice: "",
      });
      handleClose();
    }
  };

  const handleDeleteUpgrade = (index) => {
    setUpgradeData(upgradeData.filter((_, i) => i !== index));
  };

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
      cpuPrice: parseInt(data?.cpu?.price),
      gpuPrice: parseInt(data?.gpu?.price),
      ramPrice: parseInt(data?.ram?.price),
      storagePrice: selectedStorage.reduce(
        (acc, sto) => acc + (parseInt(sto.price) || 0),
        0
      ),
      status: data?.status.value,
      psuPrice: parseInt(data?.psu?.price),
      motherboardPrice: parseInt(data?.motherboard?.price),
      airCoolerPrice: parseInt(data?.airCooler?.price),
      gamingCasePrice: parseInt(data?.gamingCase?.price),
      stock: parseInt(data?.stock),
      isFeatured: data?.isFeatured.value,
      powerCategory: parseInt(data?.powerCategory.value),
      productType: productType,
      category: data?.category.value,
      components: {
        cpu: data?.cpu.value,
        gpu: data?.gpu.value,
        ram: data?.ram.value,
        storage: selectedStorage.map((sto) => sto._id),
        psu: data?.psu.value,
        motherboard: data?.motherboard.value,
        airCooler: data?.airCooler.value,
        gamingCase: data?.gamingCase.value,
      },

      hasUpgradeOptions: upgradeData.length !== 0 ? true : false,
      upgradeOptions: hasUpgradeOptions ? upgradeData : [],

      images: images,
    };

    const response = await apiSubmit({
      url: `${apis().updatePrebuild.url}${productId}`,
      method: apis().updatePrebuild.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Updating Product...",
    });

    if (response?.success) {
      setFiles([]);
      reset();
      setProductData({});
      setUpgradeData([]);
      setSelectedStorage([]);
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
        "category",
        response.data.category
          ? {
              value: response.data.category.name,
              label: response.data.category.name,
            }
          : null
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
        "cpu",
        response.data.components.cpu
          ? {
              value: response.data.components.cpu._id,
              label: response.data.components.cpu.model,
              price: response.data.components.cpu.price,
            }
          : null
      );
      setValue(
        "gpu",
        response.data.components.gpu
          ? {
              value: response.data.components.gpu._id,
              label: response.data.components.gpu.model,
              price: response.data.components.gpu.price,
            }
          : null
      );
      setValue(
        "ram",
        response.data.components.ram
          ? {
              value: response.data.components.ram._id,
              label: response.data.components.ram.model,
              price: response.data.components.ram.price,
            }
          : null
      );
      if (response?.data?.components?.storage) {
        setValue(
          "storage",
          response?.data?.components?.storage
            ? [
                {
                  value: response.data.components.storage._id,
                  label: response.data.components.storage.model,
                  itemData: response.data.components.storage,
                },
              ]
            : null
        );
      }

      setValue(
        "psu",
        response.data.components.psu
          ? {
              value: response.data.components.psu._id,
              label: response.data.components.psu.model,
              price: response.data.components.psu.price,
            }
          : null
      );
      setValue(
        "motherboard",
        response.data.components.motherboard
          ? {
              value: response.data.components.motherboard._id,
              label: response.data.components.motherboard.model,
              price: response.data.components.motherboard.price,
            }
          : null
      );
      setValue(
        "airCooler",
        response.data.components.airCooler
          ? {
              value: response.data.components.airCooler._id,
              label: response.data.components.airCooler.model,
              price: response.data.components.airCooler.price,
            }
          : null
      );
      setValue(
        "gamingCase",
        response.data.components.gamingCase
          ? {
              value: response.data.components.gamingCase._id,
              label: response.data.components.gamingCase.model,
              price: response.data.components.gamingCase.price,
            }
          : null
      );
      setValue(
        "hasUpgradeOptions",
        response.data.hasUpgradeOptions
          ? {
              value: response.data.hasUpgradeOptions,
              label: response.data.hasUpgradeOptions,
            }
          : null
      );
      setUpgradeData(response.data.upgradeOptions || []);
      setFiles(response.data.images);
    }
  };

  const showAllCpu = async () => {
    const response = await apiSubmit({
      url: apis().getCpuDropdown.url,
      method: apis().getCpuDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    setCpuData(response?.success ? response?.data?.cpus : []);
  };

  const showAllGpu = async () => {
    const response = await apiSubmit({
      url: apis().getGpuDropdown.url,
      method: apis().getGpuDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setGpuData(response?.data?.gpus) : [];
  };

  const showAllRam = async () => {
    const response = await apiSubmit({
      url: apis().getRamDropdown.url,
      method: apis().getRamDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setRamData(response?.data?.rams) : [];
  };

  const showAllStorage = async () => {
    const response = await apiSubmit({
      url: apis().getStorageDropdown.url,
      method: apis().getStorageDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setStorageData(response?.data?.storages) : [];
  };

  const showAllPsu = async () => {
    const response = await apiSubmit({
      url: apis().getPsuDropdown.url,
      method: apis().getPsuDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setPsuData(response?.data?.psus) : [];
  };

  const showAllCase = async () => {
    const response = await apiSubmit({
      url: apis().getCaseDropdown.url,
      method: apis().getCaseDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setCaseData(response?.data?.cases) : [];
  };

  const showAllMotherboard = async () => {
    const response = await apiSubmit({
      url: apis().getMotherboardDropdown.url,
      method: apis().getMotherboardDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setMotherboardData(response?.data?.motherboards) : [];
  };

  const showAllCooler = async () => {
    const response = await apiSubmit({
      url: apis().getCoolerDropdown.url,
      method: apis().getCoolerDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setCoolerData(response?.data?.coolers) : [];
  };

  // Initial Fetch
  useEffect(() => {
    fetchProductData();
    showAllCpu();
    showAllGpu();
    showAllRam();
    showAllStorage();
    showAllPsu();
    showAllCase();
    showAllMotherboard();
    showAllCooler();
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
      <div className=" grid grid-cols-2 mb-3 gap-5">
        <div className="col">
          <h3 className="text-base font-medium mb-1">Product Old Price *</h3>
          <input
            type="number"
            placeholder="10000 "
            disabled
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

          {errors.status && (
            <span className="text-red-500 text-sm mt-1">
              {errors.status.message}
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
      <div className=" grid grid-cols-2 mb-5 gap-5">
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
      </div>
      <div className=" grid grid-cols-1 mb-5 gap-5">
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select Category * </h3>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Psu is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={
                  ["Gaming", "Productivity"]?.map((item) => ({
                    value: item,
                    label: item,
                  })) || []
                }
              />
            )}
          />

          {errors.category && (
            <span className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </span>
          )}
        </div>
      </div>
      <div className=" grid grid-cols-4 mb-5 gap-5">
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select Cpu * </h3>
          <Controller
            name="cpu"
            control={control}
            rules={{ required: "Cpu is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select CPU"
                classNamePrefix="select"
                options={
                  cpuData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    price: item.price,
                  })) || []
                }
              />
            )}
          />

          {errors.cpu && (
            <span className="text-red-500 text-sm mt-1">
              {errors.cpu.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select Gpu * </h3>
          <Controller
            name="gpu"
            control={control}
            rules={{ required: "Gpu is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={
                  gpuData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    price: item.price,
                  })) || []
                }
              />
            )}
          />

          {errors.gpu && (
            <span className="text-red-500 text-sm mt-1">
              {errors.gpu.message}
            </span>
          )}
        </div>{" "}
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select Ram * </h3>
          <Controller
            name="ram"
            control={control}
            rules={{ required: "Ram is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={
                  ramData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    price: item.price,
                  })) || []
                }
              />
            )}
          />

          {errors.ram && (
            <span className="text-red-500 text-sm mt-1">
              {errors.ram.message}
            </span>
          )}
        </div>{" "}
        <div className="col">
          <h3 className="text-base font-medium mb-1">
            Select Storage (1 or 2) *{" "}
          </h3>
          <Controller
            name="storage"
            control={control}
            rules={{ required: "Storage is required" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                className="w-full text-sm font-medium"
                placeholder="Select storage"
                classNamePrefix="select"
                options={
                  storageData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    itemData: item,
                  })) || []
                }
                value={field.value}
                onChange={(selectedOptions) => {
                  const limited = selectedOptions?.slice(0, 2) || [];
                  field.onChange(limited);
                }}
              />
            )}
          />

          {errors.storage && (
            <span className="text-red-500 text-sm mt-1">
              {errors.storage.message}
            </span>
          )}
        </div>
      </div>
      <div className=" grid grid-cols-4 mb-5 gap-5">
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select Psu * </h3>
          <Controller
            name="psu"
            control={control}
            rules={{ required: "Psu is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={
                  psuData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    price: item.price,
                  })) || []
                }
              />
            )}
          />

          {errors.psu && (
            <span className="text-red-500 text-sm mt-1">
              {errors.psu.message}
            </span>
          )}
        </div>
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select Motherboard * </h3>
          <Controller
            name="motherboard"
            control={control}
            rules={{ required: "Motherboard is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={
                  motherboardData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    price: item.price,
                  })) || []
                }
              />
            )}
          />

          {errors.motherboard && (
            <span className="text-red-500 text-sm mt-1">
              {errors.motherboard.message}
            </span>
          )}
        </div>{" "}
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select airCooler * </h3>
          <Controller
            name="airCooler"
            control={control}
            rules={{ required: "airCooler is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={
                  coolerData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    price: item.price,
                  })) || []
                }
              />
            )}
          />

          {errors.airCooler && (
            <span className="text-red-500 text-sm mt-1">
              {errors.airCooler.message}
            </span>
          )}
        </div>{" "}
        <div className="col">
          <h3 className="text-base font-medium mb-1">Select Gaming Case * </h3>
          <Controller
            name="gamingCase"
            control={control}
            rules={{ required: "Gaming Case is required" }}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full text-sm font-medium"
                placeholder="Select socket type"
                classNamePrefix="select"
                options={
                  caseData?.map((item) => ({
                    value: item._id,
                    label: item.model,
                    price: item.price,
                  })) || []
                }
              />
            )}
          />

          {errors.gamingCase && (
            <span className="text-red-500 text-sm mt-1">
              {errors.gamingCase.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <div
          className={`grid ${
            hasUpgradeOptions ? "grid-cols-1" : "grid-cols-4"
          } mb-5 gap-5`}
        >
          <div className="col">
            <h3 className="text-base font-medium mb-1">
              Has Upgrade Options *
            </h3>
            <Controller
              name="hasUpgradeOptions"
              control={control}
              disabled={upgradeData.length < 1}
              rules={{ required: "Has Upgrade Options is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  className="w-full text-sm font-medium"
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                  value={
                    field.value !== undefined
                      ? {
                          value: field.value,
                          label: field.value ? "Yes" : "No",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value);
                    setHasUpgradeOptions(selectedOption.value);
                  }}
                />
              )}
            />

            {errors.hasUpgradeOptions && (
              <span className="text-red-500 text-sm mt-1">
                {errors.hasUpgradeOptions.message}
              </span>
            )}
          </div>
        </div>

        {hasUpgradeOptions && upgradeData.length < 3 && (
          <Button
            className="!capitalize !mb-5"
            variant="contained"
            color="primary"
            onClick={handleOpen}
          >
            Add Upgrade Option
          </Button>
        )}

        <Modal open={open} onClose={handleClose}>
          <div className="p-5 bg-white rounded shadow-md w-96 mx-auto mt-20 flex flex-col gap-3">
            <h2 className="text-lg font-bold mb-4">Add Upgrade Option</h2>

            <TextField
              label="Upgrade Name"
              fullWidth
              type="text"
              placeholder="e.g., 16 GB RAM"
              value={newUpgrade.upgradeName}
              onChange={(e) =>
                setNewUpgrade({ ...newUpgrade, upgradeName: e.target.value })
              }
              className="mb-3"
            />
            <TextField
              label="Additional Price"
              type="number"
              placeholder="e.g., 1000"
              step={1}
              fullWidth
              value={newUpgrade.additionalPrice}
              onChange={(e) =>
                setNewUpgrade({
                  ...newUpgrade,
                  additionalPrice: e.target.value,
                })
              }
              className="mb-3"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUpgrade}
            >
              Submit
            </Button>
          </div>
        </Modal>

        {upgradeData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Added Upgrade Options</h3>
            {upgradeData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border mb-2"
              >
                <span>
                  {item.upgradeName} ({item.additionalPrice})
                </span>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteUpgrade(index)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
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

export default PrebuildEditForm;
