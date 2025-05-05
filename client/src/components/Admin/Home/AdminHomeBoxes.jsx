import React, { memo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { RiProductHuntLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoBarChartSharp } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminHomeBoxes = () => {
  const { apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { adminStatsActions, dispatch, adminStats } = useReduxHooks();

  const [stats, setStats] = useState(null);

  const getStats = async () => {
    const response = await apiSubmit({
      url: apis().getStats.url,
      method: apis().getStats.method,
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Fetching Stats...",
    });

    if (response?.success) {
      setStats(response?.data);
      dispatch(adminStatsActions.updateData(response?.data?.chartData));
    }
  };

  //  when order, product or user is deleted or updated we need to update the admin stats usestate data on admin hom page component so we will use redux to update the data once the refactor is done
  if (adminStats.ordersDataChange) {
    getStats();
    dispatch(adminStatsActions.updateOrdersDataChange(false));
  }

  if (adminStats.productsDataChange) {
    getStats();
    dispatch(adminStatsActions.updateProductsDataChange(false));
  }

  if (adminStats.usersDataChange) {
    getStats();
    dispatch(adminStatsActions.updateUsersDataChange(false));
  }

  useEffect(() => {
    getStats();
  }, []);

  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={10}
      navigation={true}
      modules={[Navigation]}
      className="homeboxesslider"
    >
      <SwiperSlide>
        <div className="box p-5 cursor-pointer hover:bg-whitebg rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
          <RiProductHuntLine className="text-lg" />
          <div className="info w-[70%] ">
            <h4>Total Products</h4>
            <b>{stats?.productCount || 0}</b>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="box p-5 cursor-pointer hover:bg-whitebg rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
          <FiUsers className="text-lg" />
          <div className="info w-[70%] ">
            <h4>Total Users</h4>
            <b>{stats?.userCount || 0}</b>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="box p-5 cursor-pointer hover:bg-whitebg rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
          <TbCategory className="text-lg" />
          <div className="info w-[70%] ">
            <h4>Total Categories</h4>
            <b>{stats?.categoryCount || 0}</b>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="box p-5 cursor-pointer hover:bg-whitebg rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
          <IoBagCheckOutline className="text-lg" />
          <div className="info w-[70%] ">
            <h4>Total Pending Orders</h4>
            <b>{stats?.pendingOrderCount || "0" || "Total Pending Orders"}</b>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="box p-5 cursor-pointer hover:bg-whitebg rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
          <IoBarChartSharp className="text-lg" />
          <div className="info w-[70%] ">
            <h4>Total Sales</h4>
            <b>{stats?.totalSalesCount || 0} Pkr</b>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="box p-5 cursor-pointer hover:bg-whitebg rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
          <BsBank className="text-lg" />
          <div className="info w-[70%] ">
            <h4>Total Revenue</h4>
            <b>{stats?.totalSalesAmount || 0} Pkr</b>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default memo(AdminHomeBoxes);
