import Select from "react-select";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks//useApiSubmit";
import { useForm, Controller } from "react-hook-form";

function Compatibility() {
  const { apis, useState, useEffect, showSuccess, useRef } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const [showResults, setshowResults] = useState({
    bottleneckPercentage: 0,
    slowerComponent: "",
  });
  const [cpuData, setCpuData] = useState([]);
  const [gpuData, setGpuData] = useState([]);
  const resultsRef = useRef(null);
  const handleProceed = () => {
    // any logic like loading, validation...
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showAllCpu = async () => {
    const response = await apiSubmit({
      url: apis().getCpuDropdown.url,
      method: apis().getCpuDropdown.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching...",
    });
    response?.success ? setCpuData(response?.data?.cpus) : [];
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

  useEffect(() => {
    showAllGpu();

    showAllCpu();
  }, []);

  const handleFormSubmit = async (data) => {
    const formattedData = {
      cpuScore: data.cpu.value,
      gpuScore: data.gpu.value,
      resolution: data.resolution.value,
      purpose: data.purpose.value,
    };

    const response = await apiSubmit({
      url: apis().getBottleneckCalculatorScore.url,
      method: apis().getBottleneckCalculatorScore.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Calculating...",
    });

    if (response?.success) {
      setshowResults({
        bottleneckPercentage: response?.data?.bottleneckPercentage,
        slowerComponent: response?.data?.slowerComponent,
      });
      setTimeout(() => {
        handleProceed();
      }, 500);
    }
  };

  const cpuOptions = cpuData?.map((cpu) => ({
    value: cpu.benchmark,
    label: cpu.model,
  }));
  const gpuOptions = gpuData?.map((gpu) => ({
    value: gpu.benchmark,
    label: gpu.model,
  }));

  return (
    <main className="bg-gray-100 flex items-center justify-center min-h-screen py-[2rem] flex-col">
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg animate__animated wow animate__fadeIn">
        <h1 className="h1 text-center text-3xl font-bold text-gray-800 mb-4">
          Bottleneck Calculator
        </h1>

        <div className="mt-6 p-6 border rounded-lg bg-gray-50">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="form mt-5 mb-10  "
          >
            <div className="flex justify-between space-x-4">
              {/* CPU Select with Image */}
              <div className="flex-1 p-4 border rounded-lg bg-white">
                <img
                  src="https://cdna.pcpartpicker.com/static/forever/images/product/49fca908d8863ded4df790bd3af6bc12.256p.jpg"
                  alt="CPU"
                  className="w-full h-32 mb-4 rounded object-contain object-center"
                />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  CPU
                </h3>
                <Controller
                  name="cpu"
                  control={control}
                  rules={{ required: "Cpu is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      isSearchable
                      placeholder="Choose a CPU..."
                      className="w-full xl:text-lg text-base"
                      options={cpuOptions}
                    />
                  )}
                />

                {errors.cpu && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.cpu.message}
                  </span>
                )}
              </div>

              {/* GPU Select with Image */}
              <div className="flex-1 p-4 border rounded-lg bg-white">
                <img
                  src="https://cdna.pcpartpicker.com/static/forever/images/product/232dd1c4ff3c7494fae18e5e99c878ce.256p.jpg"
                  alt="GPU"
                  className="w-full h-32 mb-4 rounded object-contain object-center"
                />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  GPU
                </h3>
                <Controller
                  name="gpu"
                  control={control}
                  rules={{ required: "Gpu is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      isSearchable
                      placeholder="Choose a GPU..."
                      className="w-full xl:text-lg text-base"
                      options={gpuOptions}
                    />
                  )}
                />

                {errors.gpu && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.gpu.message}
                  </span>
                )}
              </div>
            </div>

            {/* Resolution Dropdown */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Select Resolution
              </h3>
              <Controller
                name="resolution"
                control={control}
                rules={{ required: "Resolution is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    isSearchable
                    placeholder="Choose a resolution..."
                    className="w-full xl:text-lg text-base"
                    options={
                      [
                        { value: "1080p", label: "1080p" },
                        { value: "1440p", label: "1440p" },
                        { value: "4K", label: "4K" },
                      ] || []
                    }
                  />
                )}
              />

              {errors.resolution && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.resolution.message}
                </span>
              )}
            </div>

            {/* Purpose Dropdown */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Select Purpose
              </h3>
              <Controller
                name="purpose"
                control={control}
                rules={{ required: "Purpose is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    isSearchable
                    placeholder="Choose a purpose..."
                    className="w-full xl:text-lg text-base"
                    options={
                      [
                        { value: "gaming", label: "Gaming" },
                        { value: "editing", label: "Editing" },
                        { value: "ai", label: "AI" },
                        { value: "general", label: "General" },
                      ] || []
                    }
                  />
                )}
              />

              {errors.purpose && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.purpose.message}
                </span>
              )}
            </div>

            {/* Proceed Button */}
            <div className="mt-6 text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {loading ? "Loading..." : "Proceed"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Box */}
      {showResults.bottleneckPercentage && showResults.slowerComponent && (
        <div className="w-full max-w-lg p-6 mt-8 bg-white shadow-lg rounded-lg border animate__animated wow animate__fadeInUp">
          <h3
            className="text-lg font-semibold mb-4 text-gray-800"
            ref={resultsRef}
          >
            Results
          </h3>
          <p className="mb-4 text-gray-700">
            `
            {`Your ${showResults.slowerComponent} is the bottleneck with a score of `}
            <span className="font-bold text-blue-600">
              {showResults.bottleneckPercentage}
            </span>
            {` of the faster component.`}
          </p>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-medium text-blue-600">0%</span>
              <span className="text-xs font-medium text-blue-600">100%</span>
            </div>
            <div className="flex">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${showResults.bottleneckPercentage}` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Compatibility;
