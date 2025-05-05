import React, { memo, useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { FileUpload, RTE } from "../../../index";
import { Button, Modal, TextField } from "@mui/material";
import useProvideHooks from "../../../../hooks/useProvideHooks";
import useApiSubmit from "../../../../hooks/useApiSubmit";
// import useReduxHooks from "../../../../hooks/useReduxHooks";

const PrebuildAddForm = ({ productType }) => {
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();

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
  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedGpu, setSelectedGpu] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedPsu, setSelectedPsu] = useState(null);
  const [selectedCooler, setSelectedCooler] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const getTotalPrice = () => {
    const storagePrices = Array.isArray(selectedStorage)
      ? selectedStorage.map((sto) => sto.price || 0)
      : [];
    const prices = [
      selectedCpu?.price,
      selectedGpu?.price,
      selectedRam?.price,
      ...storagePrices,
      selectedPsu?.price,
      selectedCooler?.price,
      selectedCase?.price,
      selectedMotherboard?.price,
    ];
    // Filter out any undefined values and sum up the rest
    console.log(
      prices
        .filter((price) => price !== undefined)
        .reduce((total, price) => total + price, 0),
      selectedCpu?.price
    );
    return prices
      .filter((price) => price !== undefined)
      .reduce((total, price) => total + price, 0);
  };

  const handleCpuSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedCpu = cpuData.find(
        (cpu) => cpu.model === selectedOption.value
      );
      console.log("selectedCpu", selectedCpu);

      setSelectedCpu(selectedCpu);
    } else {
      setSelectedCpu([]);
    }
  };

  const handleGpuSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedGpu = gpuData.find(
        (gpu) => gpu.model === selectedOption.value
      );
      toast.success("GPU selected");
      setSelectedGpu(selectedGpu);
    } else {
      toast.success("GPU removed");
      setSelectedGpu(null);
    }
  };

  const handleRamSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedRam = ramData.find(
        (ram) => ram.model === selectedOption.value
      );
      if (
        selectedMotherboard &&
        selectedMotherboard.memoryType !== selectedRam.ramType
      ) {
        toast.error(
          `Ram use ${selectedRam.ramType}, Not compatible with Motherboard ${selectedMotherboard.memoryType}`
        );

        return; // Exit the function early
      }
      toast.success("RAM selected");
      setSelectedRam(selectedRam);
    } else {
      toast.success("RAM removed");
      setSelectedRam(null);
    }
  };

  const handleStorageSelect = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 2) {
      toast.error("Cannot add more than two");
      return;
    }

    if (selectedOptions) {
      const selected = selectedOptions.map((option) =>
        storageData.find((storage) => storage.model === option.value)
      );
      toast.success("Storage selected");
      setSelectedStorage(selected);
    } else {
      toast.success("Storage removed");
      setSelectedStorage([]);
    }
  };

  const handlePsuSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedPsu = psuData.find(
        (psu) => psu.model === selectedOption.value
      );
      toast.success("PSU selected");
      setSelectedPsu(selectedPsu);
    } else {
      toast.success("PSU removed");
      setSelectedPsu(null);
    }
  };

  const handleCaseSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedCase = caseData.find(
        (gcase) => gcase.model === selectedOption.value
      );
      if (
        selectedMotherboard &&
        selectedMotherboard.formFactor !== selectedCase.formFactor
      ) {
        toast.error(
          `Case use ${selectedCase.formFactor} Form Factor, Not compatible with Motherboard ${selectedMotherboard.formFactor} Form Factor`
        );

        return; // Exit the function early
      }
      toast.success("Case selected");
      setSelectedCase(selectedCase);
    } else {
      toast.success("Case removed");
      setSelectedCase(null);
    }
  };

  const handleMotherboardSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedMotherboard = motherboardData.find(
        (motherboard) => motherboard.model === selectedOption.value
      );
      if (selectedCpu && selectedCpu.socket !== selectedMotherboard.socket) {
        toast.error(
          `Motherboard use ${selectedMotherboard.socket} Socket, Not compatible with Cpu ${selectedCpu.socket} Socket`
        );
        return; // Exit the function early
      }
      if (
        selectedRam &&
        selectedRam.ramType !== selectedMotherboard.memoryType
      ) {
        toast.error(
          `Motherboard use ${selectedMotherboard.memoryType}, Not compatible with Ram ${selectedRam.ramType}`
        );
        return; // Exit the function early
      }
      if (
        selectedCase &&
        selectedCase.formFactor !== selectedMotherboard.formFactor
      ) {
        toast.error(
          `Motherboard use ${selectedMotherboard.formFactor} Form Factor, Not compatible with Case ${selectedCase.formFactor} Form Factor`
        );

        return; // Exit the function early
      }

      toast.success("Motherboard selected");
      setSelectedMotherboard(selectedMotherboard);
    } else {
      toast.success("Motherboard removed");
      setSelectedMotherboard(null);
    }
  };

  const handleCoolerSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedCooler = coolerData.find(
        (cooler) => cooler.model === selectedOption.value
      );
      if (selectedCpu && selectedCooler.socket !== selectedCpu.socket) {
        toast.error(
          `Cooler use ${selectedCooler.socket} Socket, Not compatible with Cpu ${selectedCpu.socket} Socket`
        );
        return; // Exit the function early
      }
      toast.success("Cooler selected");
      setSelectedCooler(selectedCooler);
    } else {
      toast.success("Cooler removed");
      setSelectedCooler(null);
    }
  };

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
    // if (files.length < 5) {
    //   return showError("5 Product images are required");
    // }

    // const images = files.map((file) => file);

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
      category: data?.category.value,
      cpu: data?.cpu.value,
      gpu: data?.gpu.value,
      ram: data?.ram.value,
      storage: selectedStorage.map((sto) => sto._id),
      psu: data?.psu.value,
      motherboard: data?.motherboard.value,
      airCooler: data?.airCooler.value,
      gamingCase: data?.gamingCase.value,
      hasUpgradeOptions: hasUpgradeOptions,
      upgradeOptions: hasUpgradeOptions ? upgradeData : [],

      // images: images,
    };
    console.log("formattedData", formattedData);
    // const response = await apiSubmit({
    //   url: apis().addProduct.url,
    //   method: apis().addProduct.method,
    //   values: formattedData,
    //   showLoadingToast: true,
    //   loadingMessage: "Adding Product, please wait...",
    // });

    // if (response.success) {
    //   setFiles([]);
    //   reset();
    // }
  };

  useEffect(() => {
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
            label="max 2000 characters"
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
            className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
            step={0.01}
            disabled
            value={
              getTotalPrice() > 0 ? getTotalPrice().toLocaleString() : "0.00"
            }
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
                  })) || []
                }
                value={
                  field.value
                    ? cpuData.find((cpu) => cpu._id === field.value)
                      ? {
                          value: field.value,
                          label: cpuData.find((cpu) => cpu._id === field.value)
                            .model,
                        }
                      : null
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption.value); // Update RHF state
                  handleCpuSelect(selectedOption); // Your local state
                }}
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
                    itemData: item, // pass full item for state
                  })) || []
                }
                value={
                  selectedStorage?.map((sto) => ({
                    value: sto._id,
                    label: sto.model,
                  })) || []
                }
                onChange={(selectedOptions) => {
                  // Limit to 2
                  const limited = selectedOptions?.slice(0, 2) || [];

                  // update react-hook-form value
                  field.onChange(limited);

                  // update your local state
                  const fullStorageItems = limited.map((opt) =>
                    storageData.find((item) => item._id === opt.value)
                  );

                  setSelectedStorage(fullStorageItems);
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
                    field.onChange(selectedOption.value); // Update React Hook Form state
                    setHasUpgradeOptions(selectedOption.value); // Your local state (if needed)
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
                  {item.componentType} - {item.upgradeName} ($
                  {item.additionalPrice})
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
        {loading ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  );
};

export default PrebuildAddForm;
