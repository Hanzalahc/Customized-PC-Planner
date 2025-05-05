import React, { memo, useEffect } from "react";
import useReduxHooks from "../../hooks/useReduxHooks";
import { useNavigate } from "react-router-dom";

import { MyAccountSidebar, MyProfile } from "../../components";

const MyAccount = () => {
  const { auth } = useReduxHooks();
  const navigate = useNavigate();
  const userAuthStatus = auth?.status;

  useEffect(() => {
    if (!userAuthStatus) {
      return navigate("/signin");
    }
  }, []);

  return (
    <section className=" py-3 laptop:py-10 w-full">
      <div className="mx-auto w-[95%] flex flex-col laptop:flex-row gap-5">
        <div className="leftside w-full laptop:w-[20%]">
          <MyAccountSidebar />
        </div>
        <div className="rightside w-full laptop:w-[50%]">
          <MyProfile />
        </div>
      </div>
    </section>
  );
};

export default memo(MyAccount);
