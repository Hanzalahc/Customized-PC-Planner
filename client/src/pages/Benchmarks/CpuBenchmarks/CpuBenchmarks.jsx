import React, { useEffect, useMemo, useState } from "react";
import Container from "../../../components/Container/Container";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";

// Search filter component
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <span className="mb-4 block">
      <input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        placeholder="Search CPU benchmarks..."
        className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </span>
  );
}

function CpuBenchmarks() {
  const { apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const [cpuData, setCpuData] = useState([]);

  useEffect(() => {
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

    showAllCpu();
  }, []);
  const data = useMemo(() => cpuData, [cpuData]);

  const columns = React.useMemo(
    () => [
      {
        Header: "CPU Name",
        accessor: "model",
      },
      {
        Header: "Benchmark",
        accessor: "benchmark",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => <span>{value} PKR</span>,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex, globalFilter }, // Get globalFilter from the state
    setGlobalFilter, // Function to set the globalFilter value
    pageCount,
  } = useTable(
    { columns, data },
    useGlobalFilter, // Use the global filter hook
    useSortBy,
    usePagination
  );

  return (
    <main>
      <Container className={"bg-gray-100 py-[2rem]"}>
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            CPU Benchmarks
          </h1>

          {/* Search Bar */}
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />

          <table
            {...getTableProps()}
            className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
          >
            <thead>
              {headerGroups?.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-b border-gray-300"
                  key={headerGroup.title}
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="py-3 px-5 text-left text-sm font-medium transition-transform transform hover:scale-105"
                      key={column.title} // Ensure unique key
                    >
                      {column.render("Header")}
                      <span className="text-white ml-2">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? "🔽"
                            : "🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {cpuData && cpuData.length > 0 ? (
                page?.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="transition-transform duration-200 transform hover:bg-blue-100 hover:scale-105"
                      key={row.original._id}
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="py-3 px-5 text-left text-sm text-gray-800"
                          key={`${row.original._id}-${cell.column.id}`}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns?.length}
                    className="text-center text-lg text-gray-800 py-4"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              onClick={previousPage}
              disabled={!canPreviousPage}
              className={`bg-gray-800 text-white px-6 py-2 rounded-lg transition-transform duration-200 
                ${
                  !canPreviousPage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-700 transform hover:scale-105"
                }`}
            >
              Previous
            </button>
            <span className="text-gray-800 text-lg">
              Page {pageIndex + 1} of {pageCount}
            </span>
            <button
              onClick={nextPage}
              disabled={!canNextPage}
              className={`bg-gray-800 text-white px-6 py-2 rounded-lg transition-transform duration-200 
                ${
                  !canNextPage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-700 transform hover:scale-105"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default CpuBenchmarks;
