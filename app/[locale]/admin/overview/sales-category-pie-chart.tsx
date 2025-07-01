"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  LabelList,
  Tooltip,
  TooltipProps,
} from "recharts";

import useColorStore from "@/hooks/use-color-store";
import { TopSalesCategory } from "@/types/order-summary.types";

// Tooltip tùy chỉnh
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-xl bg-popover text-foreground flex items-center px-3 py-2 shadow gap-2 border border-primary">
        <div className="font-semibold text-sm">{item.name}</div>
        <div className="text-sm text-primary">
          Sales: <strong>${item.value}</strong>
        </div>
      </div>
    );
  }

  return null;
};

export default function SalesCategoryPieChart({
  data,
}: {
  data: TopSalesCategory[];
}) {
  const { theme } = useTheme();
  const { cssColors } = useColorStore(theme);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalSales"
          nameKey="_id"
          cx="50%"
          cy="50%"
          labelLine={false}
        >
          <LabelList
            dataKey="_id"
            className="fill-foreground"
            stroke="none"
            fontSize={12}
          />
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                cssColors[`--chart-${index}`] || cssColors["--primary"]
              }
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}