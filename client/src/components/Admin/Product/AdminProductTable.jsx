import React, { memo, useState, useEffect, useMemo } from "react";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import useReduxHooks from "../../../hooks/useReduxHooks";
import { AdminAddProductButton } from "../";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const AdminProductTable = () => {
  const { apis } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { products, productActions, dispatch, adminStatsActions } =
    useReduxHooks();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [productData, setProductData] = useState([]);

  const tableHeadRow = [
    "Product",
    "Product Type",
    "Price",
    "Sales",
    "Stock",
    "Featured",
    "Status",
    "Action",
  ];

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return productData;

    const lowerCaseQuery = searchQuery.toLowerCase();

    return productData.filter(
      (product) =>
        [product.name, product.productType].some((field) =>
          field?.toLowerCase().includes(lowerCaseQuery)
        ) ||
        [product.price, product.sale, product.stock].some((field) =>
          field?.toString().includes(searchQuery)
        )
    );
  }, [productData, searchQuery]);

  const handleDelete = async (id) => {
    const response = await apiSubmit({
      url: apis().deleteProduct.url,
      method: apis().deleteProduct.method,
      values: { productId: id },
      showLoadingToast: true,
      loadingMessage: "Deleting product, please wait...",
    });

    if (response?.success) {
      setSelectedProducts((prev) => prev.filter((item) => item !== id));
      setIsAllSelected(false);
      setProductData((prev) => prev.filter((item) => item._id !== id));
      dispatch(adminStatsActions.updateProductsDataChange(true));
    } else {
      setSelectedProducts((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDeleteSelected = async () => {
    const response = await apiSubmit({
      url: apis().deleteMultipleProducts.url,
      method: apis().deleteMultipleProducts.method,
      values: { productIds: selectedProducts },
      showLoadingToast: true,
      loadingMessage: "Deleting products, please wait...",
    });

    if (response.success) {
      setSelectedProducts([]);
      setIsAllSelected(false);
      dispatch(adminStatsActions.updateProductsDataChange(true));
    }
  };

  const handleHeaderCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsAllSelected(checked);
    setSelectedProducts(checked ? productData.map((item) => item._id) : []);
  };

  const handleRowCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, id]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter((productId) => productId !== id)
      );
    }
  };

  const handleCategoryFilter = async (productType) => {
    if (productType == "") {
      fetchProducts(productCurrentPage);
      return;
    }

    const response = await apiSubmit({
      url: `${apis().getProductsByProductType.url}${productType}`,
      method: apis().getProductsByProductType.method,
      query: { pageNum: productCurrentPage },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response?.success) {
      setProductData(response.data);
      // dispatch(productActions.setProducts(response.data));
      setProductTotalPages(response.totalPages);
    } else {
      setProductData([]);
    }
  };

  const handleStatusFilter = async (status) => {
    if (status == "") {
      fetchProducts(productCurrentPage);
      return;
    }

    const response = await apiSubmit({
      url: `${apis().getProductsByStatus.url}${status}`,
      method: apis().getProductsByStatus.method,
      query: { pageNum: productCurrentPage },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      // dispatch(productActions.setProducts(response.data));
      setProductData(response.data);
      setProductTotalPages(response.totalPages);
    } else {
      setProductData([]);
    }
  };

  const handlePrebuildCategoryFilter = async (categoryId) => {
    if (categoryId == "") {
      fetchProducts(productCurrentPage);
      return;
    }

    const response = await apiSubmit({
      url: `${apis().getPrebuildProductsByCategory.url}${categoryId}`,
      method: apis().getPrebuildProductsByCategory.method,
      query: { pageNum: productCurrentPage },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response?.success) {
      // dispatch(productActions.setProducts(response.data));
      setProductData(response.data);
      setProductTotalPages(response.totalPages);
    } else {
      setProductData([]);
    }
  };

  const fetchProducts = async (page) => {
    const response = await apiSubmit({
      url: `${apis().getAllProducts.url}`,
      method: apis().getAllProducts.method,
      query: { pageNum: page },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setProductData(response.data);
      setProductTotalPages(response.totalPages);
    }
  };

  const handleProductPageChange = (event, page) => {
    setProductCurrentPage(page);
    fetchProducts(page);
  };

  // Initial Fetch
  useEffect(() => {
    fetchProducts(productCurrentPage);
  }, []);

  return (
    <div className="card my-4 bg-white tablet:rounded-lg shadow-md ">
      <div className="flex items-center justify-between px-5 py-5">
        <h3 className="text-lg font-semibold">Products</h3>
        <AdminAddProductButton />
      </div>
      {/* filters */}
      <div className="flex items-end  w-full px-5  gap-5">
        <div className="col w-[20%]">
          <h4 className="font-semibold text-sm mb-2">Filter By Product Type</h4>
          <Select
            className="w-full "
            size="small"
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Category"
          >
            <MenuItem onClick={() => handleCategoryFilter("")}>
              <em>None</em>
            </MenuItem>
            {[
              "Cpu",
              "Ram",
              "Prebuild",
              "Gpu",
              "Cooler",
              "Psu",
              "Storage",
              "Case",
              "Motherboard",
            ].map((category) => (
              <MenuItem
                key={category}
                className="!text-sm !font-medium"
                onClick={() => handleCategoryFilter(category)}
                value={category}
              >
                {category}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="col w-[20%]">
          <h4 className="font-semibold text-sm mb-2">Filter By Status</h4>
          <Select
            className="w-full "
            size="small"
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Category"
          >
            <MenuItem onClick={() => handleStatusFilter("")}>
              <em>None</em>
            </MenuItem>
            <MenuItem
              onClick={() => handleStatusFilter("active")}
              value={"active"}
            >
              Active
            </MenuItem>
            <MenuItem
              onClick={() => handleStatusFilter("inactive")}
              value={"inactive"}
            >
              Inactive
            </MenuItem>
          </Select>
        </div>
        <div className="col w-[20%]">
          <h4 className="font-semibold text-sm mb-2">
            Filter By Prebuild Category
          </h4>
          <Select
            className="w-full "
            size="small"
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Category"
          >
            <MenuItem onClick={() => handlePrebuildCategoryFilter("")}>
              <em>None</em>
            </MenuItem>
            <MenuItem
              onClick={() =>
                handlePrebuildCategoryFilter("67e2b35dd89878634d8f86ef")
              }
              value={"67e2b35dd89878634d8f86ef"}
            >
              Gaming
            </MenuItem>
            <MenuItem
              onClick={() =>
                handlePrebuildCategoryFilter("67e2b36cd89878634d8f86f2")
              }
              value={"67e2b36cd89878634d8f86f2"}
            >
              Productivity
            </MenuItem>
            
          </Select>
        </div>

        <div className="col w-[20%] ml-auto">
          <div className="w-full h-auto  bg-whitebg relative overflow-hidden">
            <IoSearch className="absolute top-3 left-3 z-50 pointer-events-none opacity-80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search here..."
              className="w-full h-10 p-2 pl-8 border border-[rgba(0,0,0,0.1)] bg-whitebg focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-md text-sm"
            />
          </div>
        </div>
      </div>
      {/* products data */}
      <div className="relative overflow-x-auto mt-5 pb-5">
        <div className="mb-3 ml-5">
          <Button
            onClick={handleDeleteSelected}
            disabled={selectedProducts.length === 0 || loading}
            variant="contained"
            color="error"
          >
            Delete Selected
          </Button>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase font-medium bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                <Checkbox
                  {...label}
                  size="small"
                  checked={isAllSelected}
                  onChange={handleHeaderCheckboxChange}
                />
              </th>
              {tableHeadRow.map((head, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredProducts?.length !== 0 ? (
              filteredProducts?.map((item) => (
                <tr
                  key={item._id}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  <td className="px-6 py-3">
                    <Checkbox
                      {...label}
                      size="small"
                      checked={selectedProducts.includes(item._id)}
                      onChange={(event) =>
                        handleRowCheckboxChange(item._id, event.target.checked)
                      }
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4 w-72">
                      <div className="img w-16 h-16 rounded-md overflow-hidden">
                        <Link to={`/product/${item._id}`}>
                          <img
                            src={item.images[0].url}
                            className="w-full group-hover:scale-105 transition-all"
                            alt={item.name}
                          />
                        </Link>
                      </div>
                      <div className="info w-[75%]">
                        <Link className="link" to={`/product/${item._id}`}>
                          <h4 className="font-medium text-xs hover:text-primary">
                            {item.name}
                          </h4>
                        </Link>
                        <span className="text-xs">{item.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">{item.productType}</td>
                  {/* <td className="px-6 py-3">
                    {item.subCategory || "No Sub Category"}
                  </td> */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-500 text-sm whitespace-nowrap">
                        {item.oldPrice} <span className="text-sm">PKR</span>
                      </span>
                      <span className="text-gray-500 font-medium text-sm whitespace-nowrap">
                        {item.price}{" "}
                        <span className="text-sm text-gray-500">PKR</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm w-24">
                      <span className="font-semibold">{item.sale}</span> Sold
                    </p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm w-24">
                      <span className="font-semibold">{item.stock}</span> in
                      Stock
                    </p>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs text-white px-2 py-1 rounded-md ${
                        item.isFeatured === true ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.isFeatured === true ? "True" : "False"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs text-white px-2 py-1 rounded-md ${
                        item.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/product-edit/${item._id}/${item.productType}`}
                      >
                        <Tooltip title="Edit" placement="top" arrow>
                          <Button className="!w-9 hover:!text-primary !rounded-full !h-9 !min-w-9 bg-whitebg !border !border-[rgba(0,0,0,0.4)]">
                            <AiOutlineEdit className="text-base text-[rgba(0,0,0,0.7)]" />
                          </Button>
                        </Tooltip>
                      </Link>
                      <Link to={`/product/${item._id}`}>
                        <Tooltip title="View" placement="top" arrow>
                          <Button className="!w-9 hover:!text-primary !rounded-full !h-9 !min-w-9 bg-whitebg !border !border-[rgba(0,0,0,0.4)]">
                            <FaRegEye className="text-base text-[rgba(0,0,0,0.7)]" />
                          </Button>
                        </Tooltip>
                      </Link>
                      <Tooltip title="Delete" placement="top" arrow>
                        <Button
                          onClick={() => handleDelete(item._id)}
                          disabled={loading}
                          className="!w-9 hover:!text-primary !rounded-full !h-9 !min-w-9 bg-whitebg !border !border-[rgba(0,0,0,0.4)]"
                        >
                          <GoTrash className="text-base text-[rgba(0,0,0,0.7)]" />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-5">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className="flex items-center justify-end pt-5 pb-5 px-4">
        <Pagination
          count={productTotalPages}
          color="primary"
          page={productCurrentPage}
          onChange={handleProductPageChange}
        />
      </div>
    </div>
  );
};

export default memo(AdminProductTable);
