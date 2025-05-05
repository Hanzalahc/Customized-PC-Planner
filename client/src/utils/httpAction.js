import toast from "react-hot-toast";
import axios from "axios";

const httpAction = (data) => async () => {
  try {
    const config = {
      method: data.method,
      url: data.params
        ? `${data.url}/${Object.values(data.params).join("/")}`
        : data.url,
      data: data.body,
      params: data.query || null,
      headers: {
        ...(data.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      withCredentials: true,
    };

    const response = await axios(config);

    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
    };
  }
};

export default httpAction;
