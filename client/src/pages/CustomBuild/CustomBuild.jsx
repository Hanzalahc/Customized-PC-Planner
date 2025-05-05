import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import Container from "../../components/Container/Container";
import toast from "react-hot-toast";
import useApiSubmit from "../../hooks/useApiSubmit";
import useProvideHooks from "../../hooks/useProvideHooks";
import useReduxHooks from "../../hooks/useReduxHooks";

function CustomBuild() {
  const { apis, loading, showSuccess } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { cartActions, dispatch, auth } = useReduxHooks();

  const [cpuData, setCpuData] = useState([]);
  const [gpuData, setGpuData] = useState([]);
  const [ramData, setRamData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [psuData, setPsuData] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [coolerData, setCoolerData] = useState([]);
  const [motherboardData, setMotherboardData] = useState([]);
  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedGpu, setSelectedGpu] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedPsu, setSelectedPsu] = useState(null);
  const [selectedCooler, setSelectedCooler] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const isUserLoggedIn = auth?.status || false;

  const selectedComponents = [
    selectedCpu,
    selectedGpu,
    selectedRam,
    selectedStorage,
    selectedPsu,
    selectedCooler,
    selectedCase,
    selectedMotherboard,
  ];

  const handleCpuSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedCpu = cpuData.find(
        (cpu) => cpu.model === selectedOption.value
      );
      if (selectedCooler && selectedCooler.socket !== selectedCpu.socket) {
        toast.error(
          `Cpu use ${selectedCpu.socket} Socket, Not compatible with Cooler ${selectedCooler.socket} Socket`
        );

        return;
      }
      if (
        selectedMotherboard &&
        selectedMotherboard.socket !== selectedCpu.socket
      ) {
        // console.log("Sockjet", selectedMotherboard.socket, selectedCpu.socket);
        toast.error(
          `Cpu use ${selectedCpu.socket} Socket, Not compatible with Motherboard ${selectedMotherboard.socket} Socket`
        );

        return; // Exit the function early
      }

      toast.success("CPU selected");
      setSelectedCpu(selectedCpu);
    } else {
      toast.success("CPU removed");
      setSelectedCpu(null);
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
    return prices
      .filter((price) => price !== undefined)
      .reduce((total, price) => total + price, 0);
  };

  const canProceedToCheckout = () => {
    return (
      selectedCpu &&
      selectedGpu &&
      selectedRam &&
      Array.isArray(selectedStorage) &&
      selectedStorage.length > 0 &&
      selectedPsu &&
      selectedCooler &&
      selectedCase &&
      selectedMotherboard
    );
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

  const handleAddToCart = () => {
    if (!isUserLoggedIn) {
      showError("Please login to add items to cart");
      return;
    }

    selectedComponents.forEach((component) => {
      // Handle storage array separately
      if (Array.isArray(component)) {
        component.forEach((item) => {
          if (item) {
            const payload = {
              ...item,
              toastAllow: false,
            };
            dispatch(cartActions?.addToCart(payload));
          }
        });
      } else if (component) {
        const payload = {
          ...component,
          toastAllow: false,
        };
        dispatch(cartActions?.addToCart(payload));
      }
    });
    showSuccess("Added to cart successfully");
    setSelectedCase(null);
    setSelectedCase(null);
    setSelectedCpu(null);
    setSelectedCooler(null);
    setSelectedMotherboard(null);
    setSelectedPsu(null);
    setSelectedRam(null);
    setSelectedStorage([]);
    setSelectedGpu(null);
  };

  const cpuOptions = cpuData?.map((cpu) => ({
    value: cpu.model,
    label: cpu.model,
  }));
  const gpuOptions = gpuData?.map((gpu) => ({
    value: gpu.model,
    label: gpu.model,
  }));

  const motherboardOptions = motherboardData?.map((motherboard) => ({
    value: motherboard.model,
    label: motherboard.model,
  }));
  const ramOptions = ramData.map((ram) => ({
    value: ram.model,
    label: ram.model,
  }));

  const storageOptions = storageData?.map((storage) => ({
    value: storage.model,
    label: storage.model,
  }));

  const cpuCoolerOptions = coolerData?.map((cooler) => ({
    value: cooler.model,
    label: cooler.model,
  }));

  const gamingCaseOptions = caseData?.map((gcase) => ({
    value: gcase.model,
    label: gcase.model,
  }));
  const powerSupplyOptions = psuData?.map((psu) => ({
    value: psu.model,
    label: psu.model,
  }));

  return (
    <main>
      <Container className={""}>
        <h1 className="h1 text-center mt-[2rem]">
          Choose Your Parts/ Custom Build
        </h1>
        {/* Wrapper table */}
        <div className="flex justify-center items-center py-[2rem] px-4 overflow-x-auto pb-[5%]">
          <table className="w-full sm:w-[90%] lg:w-[90%] border-collapse table-fixed ml-[27rem] md:ml-[25rem] lg:ml-[2rem]">
            <thead className="border border-solid border-[#e2e9e1] border-x-0">
              <tr>
                <td className="text-center w-[150px] sm:w-[250px] font-bold text-sm py-5">
                  Component
                </td>
                <td className="text-center w-[200px] sm:w-[250px] font-bold text-sm py-5">
                  Selection
                </td>
                <td className="text-center w-[150px] sm:w-[250px] font-bold text-sm py-5">
                  Product
                </td>
                <td className="text-center w-[100px] sm:w-[150px] font-bold text-sm py-5">
                  Price
                </td>
              </tr>
            </thead>

            <tbody className="text-center">
              {/* Row for each component */}
              <tr>
                {/* Component Name */}
                <td className="pt-4 text-sm text-gray-800">CPU</td>

                {/* Searchable Dropdown for CPU */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={cpuOptions}
                      onChange={handleCpuSelect}
                      isClearable
                      value={
                        selectedCpu
                          ? {
                              value: selectedCpu?.model || "",
                              label: selectedCpu?.model || "",
                            }
                          : null
                      }
                      isSearchable
                      placeholder="Choose a CPU..."
                      className="w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>

                {/* Empty Column */}
                <td className="pt-4 text-sm flex justify-center items-center">
                  {selectedCpu ? (
                    <>
                      <img
                        className="object-cover object-center w-[50px] h-[50px] rounded"
                        alt={selectedCpu.model}
                        src={selectedCpu.images[0].url}
                      />
                      <span className=" text-[12px] text-gray-800">
                        {selectedCpu.model}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </td>

                {/* Price */}
                <td className="pt-4 text-sm text-gray-800">
                  PKR - {selectedCpu ? selectedCpu.price : ""}
                </td>
              </tr>

              {/* Row for each component */}
              <tr>
                <td className="pt-4 text-sm">CPU Cooler</td>
                {/* cpu cooler Dropdown */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={cpuCoolerOptions}
                      onChange={handleCoolerSelect}
                      value={
                        selectedCooler
                          ? {
                              value: selectedCooler.model,
                              label: selectedCooler.model,
                            }
                          : null
                      }
                      isClearable
                      isSearchable
                      placeholder="Choose a Cooler..."
                      className="w-full text-sm border border-gray-300 rounded-lg"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>

                <td className="pt-4 text-sm flex justify-center items-center">
                  {selectedCooler ? (
                    <>
                      <img
                        className="object-cover object-center w-[50px] h-[50px] rounded"
                        alt={selectedCooler.model}
                        src={selectedCooler.images[0].url}
                      />
                      <span className=" text-[12px] text-gray-800">
                        {selectedCooler.model}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td className="pt-4 text-sm text-gray-800">
                  PKR - {selectedCooler ? selectedCooler.price : ""}
                </td>
              </tr>
              {/* Row for each component */}
              <tr>
                <td className="pt-4 text-sm">Motherboard</td>
                {/* search for mb */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={motherboardOptions}
                      onChange={handleMotherboardSelect}
                      value={
                        selectedMotherboard
                          ? {
                              value: selectedMotherboard.model,
                              label: selectedMotherboard.model,
                            }
                          : null
                      }
                      isClearable
                      isSearchable
                      placeholder="Choose a Motherboard..."
                      className="w-full text-sm border border-gray-300 rounded-lg"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>
                <td className="pt-4 text-sm flex justify-center items-center">
                  {selectedMotherboard ? (
                    <>
                      <img
                        className="object-cover object-center w-[50px] h-[50px] rounded"
                        alt={selectedMotherboard.model}
                        src={selectedMotherboard.images[0].url}
                      />
                      <span className=" text-[12px] text-gray-800">
                        {selectedMotherboard.model}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td className="pt-4 text-sm text-gray-800">
                  PKR - {selectedMotherboard ? selectedMotherboard.price : ""}
                </td>
              </tr>
              {/* Row for each component */}
              <tr>
                <td className="pt-4 text-sm">RAM/ Memory</td>
                {/* search for ram */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={ramOptions}
                      onChange={handleRamSelect}
                      value={
                        selectedRam
                          ? {
                              value: selectedRam.model,
                              label: selectedRam.model,
                            }
                          : null
                      }
                      isClearable
                      isSearchable
                      placeholder="Choose a RAM..."
                      className="w-full text-sm border border-gray-300 rounded-lg"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>
                {/* Empty Column */}
                <td className="pt-4 text-sm flex justify-center items-center">
                  {selectedRam ? (
                    <>
                      <img
                        className="object-cover object-center w-[50px] h-[50px] rounded"
                        alt={selectedRam.model}
                        src={selectedRam.images[0].url}
                      />
                      <span className=" text-[12px] text-gray-800">
                        {selectedRam.model}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </td>
                {/* Price */}
                <td className="pt-4 text-sm text-gray-800">
                  PKR - {selectedRam ? selectedRam.price : ""}
                </td>
              </tr>
              {/* Row for each component */}
              <tr>
                <td className="pt-4 text-sm">Storage</td>
                {/* Searchable Dropdown for Storage */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={storageOptions}
                      onChange={handleStorageSelect}
                      isMulti
                      value={
                        selectedStorage?.map((sto) => ({
                          value: sto.model,
                          label: sto.model,
                        })) || []
                      }
                      isClearable
                      isSearchable
                      placeholder="Choose a Storage..."
                      className="w-full text-sm border border-gray-300 rounded-lg"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>

                {/* Empty Column */}
                <td className="pt-4 text-sm flex justify-center items-center">
                  {Array.isArray(selectedStorage) &&
                    selectedStorage.length > 0 && (
                      <>
                        {selectedStorage.map((sto, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-1"
                          >
                            <img
                              className="object-cover object-center w-[50px] h-[50px] rounded"
                              alt={sto.model}
                              src={sto.images?.[0]?.url}
                            />
                            <span className="text-[12px] text-gray-800">
                              {sto.model}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                </td>

                {/* Price */}
                <td className="pt-4 text-sm text-gray-800">
                  PKR -{" "}
                  {Array.isArray(selectedStorage)
                    ? selectedStorage.reduce(
                        (total, sto) => total + (sto.price || 0),
                        0
                      )
                    : ""}
                </td>
              </tr>
              {/* Row for each component */}
              <tr>
                <td className="pt-4 text-sm">GPU</td>
                {/* Searchable Dropdown for gPU */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={gpuOptions}
                      onChange={handleGpuSelect}
                      value={
                        selectedGpu
                          ? {
                              value: selectedGpu.model,
                              label: selectedGpu.model,
                            }
                          : null
                      }
                      isClearable
                      isSearchable
                      placeholder="Choose a GPU..."
                      className="w-full text-sm border border-gray-300 rounded-lg"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>
                <td className="pt-4 text-sm flex justify-center items-center">
                  {selectedGpu ? (
                    <>
                      <img
                        className="object-cover object-center w-[50px] h-[50px] rounded"
                        alt={selectedGpu.model}
                        src={selectedGpu.images[0].url}
                      />
                      <span className=" text-[12px] text-gray-800">
                        {selectedGpu.model}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td className="pt-4 text-sm text-gray-800">
                  PKR - {selectedGpu ? selectedGpu.price : ""}
                </td>
              </tr>
              {/* Row for each component */}
              <tr>
                <td className="pt-4 text-sm">Gaming Case</td>
                {/* Searchable Dropdown for case */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={gamingCaseOptions}
                      onChange={handleCaseSelect}
                      value={
                        selectedCase
                          ? {
                              value: selectedCase.model,
                              label: selectedCase.model,
                            }
                          : null
                      }
                      isClearable
                      isSearchable
                      placeholder="Choose a Gaming Case..."
                      className="w-full text-sm border border-gray-300 rounded-lg"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>
                <td className="pt-4 text-sm flex justify-center items-center">
                  {selectedCase ? (
                    <>
                      <img
                        className="object-cover object-center w-[50px] h-[50px] rounded"
                        alt={selectedCase.model}
                        src={selectedCase.images[0].url}
                      />
                      <span className=" text-[12px] text-gray-800">
                        {selectedCase.model}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td className="pt-4 text-sm text-gray-800">
                  PKR - {selectedCase ? selectedCase.price : ""}
                </td>
              </tr>
              {/* Row for each component */}
              <tr>
                <td className="pt-4 text-sm">PSU</td>
                {/* Searchable Dropdown for PSU */}
                <td className="pt-4 text-sm w-[300px]">
                  <div className="relative">
                    <Select
                      options={powerSupplyOptions}
                      onChange={handlePsuSelect}
                      value={
                        selectedPsu
                          ? {
                              value: selectedPsu.model,
                              label: selectedPsu.model,
                            }
                          : null
                      }
                      isClearable
                      isSearchable
                      placeholder="Choose a Power Supply..."
                      className="w-full text-sm border border-gray-300 rounded-lg"
                      classNamePrefix="react-select"
                    />
                  </div>
                </td>
                {/* Empty Column */}
                <td className="pt-4 text-sm flex justify-center items-center">
                  {selectedPsu ? (
                    <>
                      <img
                        className="object-cover object-center w-[50px] h-[50px] rounded"
                        alt={selectedPsu.model}
                        src={selectedPsu.images[0].url}
                      />
                      <span className=" text-[12px] text-gray-800">
                        {selectedPsu.model}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </td>

                {/* Price */}
                <td className="pt-4 text-sm text-gray-800">
                  PKR - {selectedPsu ? selectedPsu.price : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* wrapper bottom */}
        <div className="flex flex-wrap flex-col md:flex-row justify-center items-center ">
          {/* right side wraper */}
          <div className="w-full md:w-[40%] border border-solid border-[#e2e9e1] p-7 text-center">
            <h3 className="pb-4 text-lg font-medium">Total</h3>
            <table className="w-full border-collapse mb-5">
              <tr>
                <td className="w-[50%] border border-solid border-[#e2e9e1] p-3 text-sm">
                  Cart SubTotal
                </td>
                <td className="w-[50%] border border-solid border-[#e2e9e1] p-3 text-sm">
                  PKR{" "}
                  {getTotalPrice() > 0
                    ? getTotalPrice().toLocaleString()
                    : "0.00"}
                </td>
              </tr>
              <tr>
                <td className="w-[50%] border border-solid border-[#e2e9e1] p-3 text-sm">
                  Shipping
                </td>
                <td className="w-[50%] border border-solid border-[#e2e9e1] p-3 text-sm">
                  Free
                </td>
              </tr>
              <tr>
                <td className="w-[50%] border border-solid border-[#e2e9e1] p-3 text-sm">
                  <strong>Total</strong>
                </td>
                <td className="w-[50%] border border-solid border-[#e2e9e1] p-3 text-sm">
                  <strong>PkR </strong>
                  {getTotalPrice() > 0
                    ? getTotalPrice().toLocaleString()
                    : "0.00"}
                </td>
              </tr>
            </table>
            <Link
              className={`flex justify-center mx-auto text-white ${
                canProceedToCheckout()
                  ? "bg-primary hover:bg-indigo-600"
                  : "bg-gray-400 cursor-not-allowed"
              } border-0 py-2 px-6 focus:outline-none rounded-lg`}
            >
              <button
                disabled={!canProceedToCheckout()}
                className="text-white"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default CustomBuild;
