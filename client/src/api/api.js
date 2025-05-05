const apis = () => {
  const local = "http://localhost:8000/";

  const list = {
    // Image
    image: {
      url: `${local}gallery/upload`,
      method: "POST",
    },

    // User
    userRegister: {
      url: `${local}user/register`,
      method: "POST",
    },
    userVerifyEmail: {
      url: `${local}user/verify-email/`,
      method: "GET",
    },
    userLogin: {
      url: `${local}user/login`,
      method: "PATCH",
    },
    userLogout: {
      url: `${local}user/logout`,
      method: "GET",
    },
    currentUser: {
      url: `${local}user/current-user`,
      method: "GET",
    },
    userForgetPassword: {
      url: `${local}user/forget-password`,
      method: "PATCH",
    },
    userVerifyPassLink: {
      url: `${local}user/verify-password-reset-token/`,
      method: "GET",
    },
    userResetPassword: {
      url: `${local}user/change-password`,
      method: "PATCH",
    },
    userUpdateDetails: {
      url: `${local}user/update-details`,
      method: "PATCH",
    },
    userUpdateAvatar: {
      url: `${local}user/update-avatar`,
      method: "PATCH",
    },
    userGoogleMethod: {
      url: `${local}user/google-login`,
      method: "POST",
    },
    refreshAccressToken: {
      url: `${local}user/refresh-token`,
      method: "POST",
    },
    getAllUsers: {
      url: `${local}user/all`,
      method: "GET",
    },
    getUsersByFilters: {
      url: `${local}user/filters`,
      method: "GET",
    },
    updateUserStatus: {
      url: `${local}user/edit-status`,
      method: "PATCH",
    },

    // Address
    addAddress: {
      url: `${local}address/add`,
      method: "POST",
    },
    getUserAllAddress: {
      url: `${local}address/all`,
      method: "GET",
    },
    deleteAddress: {
      url: `${local}address/delete`,
      method: "DELETE",
    },

    // contact
    contact: `${local}contact/submit`,

    // Product
    getProductsBySearch: {
      url: `${local}product/search`,
      method: "GET",
    },

    getSingleProduct: {
      url: `${local}product/get-single/`,
      method: "GET",
    },
    getAllProducts: {
      url: `${local}product/get-all`,
      method: "GET",
    },
    getProductsByProductType: {
      url: `${local}product/get-by-category/`,
      method: "GET",
    },
    getProductsByStatus: {
      url: `${local}product/get-by-status/`,
      method: "GET",
    },

    getPrebuildProductsByCategory: {
      url: `${local}product/get-prebuild-by-category/`,
      method: "GET",
    },
    

    // cpu
    cpuAdd: {
      url: `${local}cpu/add`,
      method: "POST",
    },
    getAllCpu: {
      url: `${local}cpu/get-all`,
      method: "GET",
    },
    getCpuDropdown: {
      url: `${local}cpu/get-all-dropdown`,
      method: "GET",
    },

    updateCpu: {
      url: `${local}cpu/update/`,
      method: "PATCH",
    },

    // gpu
    gpuAdd: {
      url: `${local}gpu/add`,
      method: "POST",
    },
    getAllGpu: {
      url: `${local}gpu/get-all`,
      method: "GET",
    },
    getGpuDropdown: {
      url: `${local}gpu/get-all-dropdown`,
      method: "GET",
    },

    updateGpu: {
      url: `${local}gpu/update/`,
      method: "PATCH",
    },

    // case
    caseAdd: {
      url: `${local}case/add`,
      method: "POST",
    },
    getAllCase: {
      url: `${local}case/get-all`,
      method: "GET",
    },
    getCaseDropdown: {
      url: `${local}case/get-all-dropdown`,
      method: "GET",
    },

    // cooler
    coolerAdd: {
      url: `${local}cooler/add`,
      method: "POST",
    },
    getAllCooler: {
      url: `${local}cooler/get-all`,
      method: "GET",
    },
    getCoolerDropdown: {
      url: `${local}cooler/get-all-dropdown`,
      method: "GET",
    },

    // motherboard
    motherboardAdd: {
      url: `${local}motherboard/add`,
      method: "POST",
    },

    getAllMotherboard: {
      url: `${local}motherboard/get-all`,
      method: "GET",
    },

    getMotherboardDropdown: {
      url: `${local}motherboard/get-all-dropdown`,
      method: "GET",
    },

    // psu
    psuAdd: {
      url: `${local}psu/add`,
      method: "POST",
    },
    getAllPsu: {
      url: `${local}psu/get-all`,
      method: "GET",
    },
    getPsuDropdown: {
      url: `${local}psu/get-all-dropdown`,
      method: "GET",
    },

    // ram
    ramAdd: {
      url: `${local}ram/add`,
      method: "POST",
    },
    getAllRam: {
      url: `${local}ram/get-all`,
      method: "GET",
    },
    getRamDropdown: {
      url: `${local}ram/get-all-dropdown`,
      method: "GET",
    },

    // storage
    storageAdd: {
      url: `${local}storage/add`,
      method: "POST",
    },
    getAllStorage: {
      url: `${local}storage/get-all`,
      method: "GET",
    },
    getStorageDropdown: {
      url: `${local}storage/get-all-dropdown`,
      method: "GET",
    },

    // build
    prebuildAdd: {
      url: `${local}prebuild/add`,
      method: "POST",
    },

    getPrebuildDropdown: {
      url: `${local}prebuild/get-all-dropdown`,
      method: "GET",
    },

    //Faq
    getFaq: `${local}faq/get`,

    // Review
    addReview: {
      url: `${local}review/add/`,
      method: "POST",
    },
    getUserReviews: {
      url: `${local}review/user`,
      method: "GET",
    },

    // order
    addOrder: {
      url: `${local}order/add`,
      method: "POST",
    },
    getUserOrders: {
      url: `${local}order/user`,
      method: "GET",
    },
    getAllOrders: {
      url: `${local}order/all`,
      method: "GET",
    },
    orderFilters: {
      url: `${local}order/filters`,
      method: "GET",
    },
    updateOrderStatus: {
      url: `${local}order/update-status`,
      method: "PATCH",
    },

    // stripe
    stripePayment: {
      url: `${local}stripe/pay`,
      method: "POST",
    },
    verifyPayment: {
      url: `${local}stripe/verify-payment`,
      method: "POST",
    },

    // admin stats
    getStats: {
      url: `${local}stats/data`,
      method: "GET",
    },
    getBottleneckCalculatorScore: {
      url: `${local}stats/bottleneck`,
      method: "POST",
    },
  };

  return list;
};

export default apis;
