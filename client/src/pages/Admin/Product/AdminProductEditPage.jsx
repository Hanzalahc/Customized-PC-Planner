import React from "react";
import useReduxHooks from "../../../hooks/useReduxHooks";
import {
  CpuEditForm,
  GpuEditForm,
  CaseEditForm,
  RamEditForm,
  CoolerEditForm,
  PsuEditForm,
  StorageEditForm,
  MotherboardEditForm,
  PrebuildEditForm,
} from "../../../components/Admin";
import { useParams } from "react-router-dom";

const AdminProductEditPage = () => {
  const { sidebar } = useReduxHooks();
  const { productType } = useParams();

  const isSidebarOpen = sidebar.isSidebarOpen;

  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      <section className="">
        <h1 className="text-lg font-semibold border-b border-[rgba(0,0,0,0.2)]  ">
          Update Product
        </h1>
        {productType === "Cpu" && <CpuEditForm />}
        {productType === "Gpu" && <GpuEditForm />}
        {productType === "Ram" && <RamEditForm />}
        {productType === "Motherboard" && <MotherboardEditForm />}
        {productType === "Storage" && <StorageEditForm />}
        {productType === "Psu" && <PsuEditForm />}
        {productType === "Cooler" && <CoolerEditForm />}
        {productType === "Case" && <CaseEditForm />}
        {productType === "Prebuild" && <PrebuildEditForm />}
      </section>
    </div>
  );
};

export default AdminProductEditPage;
