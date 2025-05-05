import React, { memo, useState } from "react";
import Select from "react-select";
import useReduxHooks from "../../../hooks/useReduxHooks";
import { useForm, Controller } from "react-hook-form";
import {
  CpuAddForm,
  GpuAddForm,
  RamAddForm,
  MotherboardAddForm,
  StorageAddForm,
  PsuAddForm,
  CoolerAddForm,
  CaseAddForm,
  PrebuildAddForm,
} from "../../../components/Admin";

const AdminProductAdd = () => {
  const { sidebar } = useReduxHooks();

  const [productType, setProductType] = useState("");

  const isSidebarOpen = sidebar?.isSidebarOpen || false;

  const {
    control,
    formState: { errors },
  } = useForm();

  return (
    <div
      className={`py-4 px-5 min-h-[100vh] ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      <section className="">
        <h1 className="h1 font-semibold border-b border-[rgba(0,0,0,0.2)]  ">
          Add Product Page
        </h1>

        <div className=" grid grid-cols-1 mt-10 mb-8">
          <div className="col">
            <h3 className="text-base font-medium mb-1">
              Select the Product Type *{" "}
            </h3>
            <Controller
              name="productType"
              control={control}
              rules={{ required: "Product type is required!" }}
              render={({ field }) => (
                <Select
                  {...field}
                  className="w-full text-sm font-medium"
                  classNamePrefix="select"
                  onChange={(selected) => {
                    field.onChange(selected);
                    setProductType(selected.value);
                  }}
                  options={[
                    { value: "Cpu", label: "Cpu" },
                    { value: "Gpu", label: "Gpu" },
                    { value: "Ram", label: "Ram" },
                    { value: "Motherboard", label: "Motherboard" },
                    { value: "Storage", label: "Storage" },
                    { value: "Psu", label: "Power Supply" },
                    { value: "Cooler", label: "Cooling/System" },
                    { value: "Case", label: "Gaming Case" },
                    { value: "Prebuild", label: "Prebuild" },
                  ]}
                />
              )}
            />

            {errors.productType && (
              <span className="text-red-500 text-sm mt-1">
                {errors.productType.message}
              </span>
            )}
          </div>
        </div>

        {productType === "Cpu" && <CpuAddForm productType={productType} />}
        {productType === "Gpu" && <GpuAddForm productType={productType} />}
        {productType === "Ram" && <RamAddForm productType={productType} />}
        {productType === "Motherboard" && (
          <MotherboardAddForm productType={productType} />
        )}
        {productType === "Storage" && <StorageAddForm productType={productType} />}
        {productType === "Psu" && <PsuAddForm productType={productType} />}
        {productType === "Cooler" && <CoolerAddForm productType={productType} />}
        {productType === "Case" && <CaseAddForm productType={productType} />}
        {productType === "Prebuild" && (
          <PrebuildAddForm productType={productType} />
        )}
        
      </section>
    </div>
  );
};

export default memo(AdminProductAdd);
