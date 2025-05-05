import React, { memo, useEffect } from "react";
import useReduxHooks from "../../hooks/useReduxHooks";
import { useNavigate } from "react-router-dom";
import { MyAccountSidebar, MyWishlist } from "../../components";

const MyWishlistPage = () => {
  const { auth } = useReduxHooks();
  const navigate = useNavigate();
  const userAuthStatus = auth?.status;

  return (
    <section className="py-3 laptop:py-10 w-full">
      <div className="mx-auto w-[95%] flex-col laptop:flex-row flex gap-5">
        <div className="leftside w-full laptop:w-[20%]">
          <MyAccountSidebar />
        </div>
        <div className="rightside w-full laptop:w-[70%]">
          <MyWishlist />
        </div>
      </div>
    </section>
  );
};

export default memo(MyWishlistPage);
