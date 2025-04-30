"use client";

import ProductPrice from "@/components/shared/product/product-price";
import useColorStore from "@/hooks/use-color-store";
import { formatDateTime } from "@/lib/utils";
import { SalesChartData } from "@/types/order-summary.types";
import { useTheme } from "next-themes";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-xl bg-popover text-foreground px-3 py-2 shadow flex flex-col items-center border border-primary">
        <p>{label && formatDateTime(new Date(label)).dateOnly}</p>
        <p className="text-primary text-xl">
          <ProductPrice price={item.value!} plain />
        </p>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick: React.FC<{
  x?: number;
  y?: number;
  payload?: { value: string };
}> = ({ x = 0, y = 0, payload }) => {
  if (!payload) return null;
  const formattedDate = formatDateTime(new Date(payload.value)).dateOnly;
  return (
    <text x={x} y={y + 10} textAnchor="left" fill="#666" fontSize="12">
      {formattedDate}
    </text>
  );
};

const STROKE_COLORS: { [key: string]: { [key: string]: string } } = {
  Red: { light: "#980404", dark: "#ff3333" },
  Green: { light: "#015001", dark: "#06dc06" },
  Gold: { light: "#ac9103", dark: "#f1d541" },
  Purple: {
    light: "#6b21a8",
    dark: "#c084fc",
  },
};

export default function SalesAreaChart({ data }: { data: SalesChartData[] }) {
  const { theme } = useTheme();
  const { cssColors, color } = useColorStore(theme);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid
          horizontal={true}
          vertical={false}
          stroke={cssColors["--muted"]}
        />
        <XAxis
          dataKey="date"
          tick={(props) => <CustomXAxisTick {...props} />}
          interval={3}
        />
        <YAxis fontSize={12} tickFormatter={(value: number) => `$${value}`} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="totalSales"
          stroke={
            STROKE_COLORS[color.name]?.[theme ?? "light"] ??
            cssColors["--primary"]
          }
          strokeWidth={2}
          fill={cssColors["--primary"]}
          fillOpacity={0.7}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}