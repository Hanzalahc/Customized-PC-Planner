import toast from "react-hot-toast";
import useProvideHooks from "./useProvideHooks";
import httpAction from "../utils/httpAction";

const useApiSubmit = () => {
  const { loading, setLoading, navigate, showSuccess } = useProvideHooks();

  const apiSubmit = async ({
    url,
    method,
    values = null,
    query = null,
    params = null,
    successMessage = undefined,
    navigateTo = null,
    showLoadingToast = false,
    loadingMessage = "Processing request...",
  }) => {
    let loadingToastId = null;

    if (showLoadingToast) {
      loadingToastId = toast.loading(loadingMessage);
    }

    setLoading(true);

    try {
      const httpRequest = httpAction({
        url,
        method,
        body: values,
        query,
        params,
      });

      const response = await httpRequest();

      if (response?.success) {
        if (successMessage !== null) {
          showSuccess(successMessage ?? response.message);
        }
        if (navigateTo) {
          navigate(navigateTo);
        }
        return response;
      } else {
        return response;
      }
    } finally {
      setLoading(false);
      if (showLoadingToast && loadingToastId) {
        toast.dismiss(loadingToastId);
      }
    }
  };

  return { apiSubmit, loading };
};

export default useApiSubmit;
