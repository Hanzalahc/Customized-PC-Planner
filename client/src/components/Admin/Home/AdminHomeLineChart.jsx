import React, { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AdminHomeBarChart = () => {
  const { adminStats } = useReduxHooks();

  const data = adminStats?.data || [];

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        {/* Primary Y-Axis for Total Sales */}
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          label={{ value: "Total Sales", angle: -90, position: "insideLeft" }}
        />
        {/* Secondary Y-Axis for Total Users (Right Side) */}
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          label={{ value: "Total Users", angle: -90, position: "insideRight" }}
        />
        <Tooltip />
        <Legend />
        {/* Bars with different yAxisId */}
        <Bar yAxisId="left" dataKey="totalSales" fill="#8884d8" barSize={50} />
        <Bar yAxisId="right" dataKey="totalUsers" fill="#82ca9d" barSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default memo(AdminHomeBarChart);
