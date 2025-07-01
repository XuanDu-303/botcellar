"use client"

import Select, { MultiValue, StylesConfig } from "react-select"
import makeAnimated from "react-select/animated"

const animatedComponents = makeAnimated()

// Define the option type
type ColorOption = {
  label: string
  value: string
  color: string
}

interface ColorMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options?: ColorOption[]
  placeholder?: string
}

const defaultColorOptions: ColorOption[] = [
  { label: "Red", value: "red", color: "#ef4444" },         // Tailwind red-500
  { label: "Rose", value: "rose", color: "#f43f5e" },        // rose-500
  { label: "Pink", value: "pink", color: "#ec4899" },        // pink-500
  { label: "Fuchsia", value: "fuchsia", color: "#d946ef" },  // fuchsia-500
  { label: "Purple", value: "purple", color: "#8b5cf6" },    // purple-500
  { label: "Violet", value: "violet", color: "#6366f1" },    // violet-500
  { label: "Blue", value: "blue", color: "#3b82f6" },        // blue-500
  { label: "Sky", value: "sky", color: "#0ea5e9" },          // sky-500
  { label: "Cyan", value: "cyan", color: "#06b6d4" },        // cyan-500
  { label: "Teal", value: "teal", color: "#14b8a6" },        // teal-500
  { label: "Green", value: "green", color: "#22c55e" },      // green-500
  { label: "Lime", value: "lime", color: "#84cc16" },        // lime-500
  { label: "Yellow", value: "yellow", color: "#eab308" },    // yellow-500
  { label: "Amber", value: "amber", color: "#f59e0b" },      // amber-500
  { label: "Orange", value: "orange", color: "#f97316" },    // orange-500
  { label: "Brown", value: "brown", color: "#92400e" },      // custom brown
]

function hexToRGBA(hex: string, alpha = 0.15) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
// 🧠 Type-safe StylesConfig
const customStyles: StylesConfig<ColorOption, true> = {
  multiValue: (base, { data }) => ({
    ...base,
    backgroundColor: hexToRGBA(data.color, 0.15),
    borderRadius: 4,
    display: "flex",
    justifyContent: "space-between",
  }),
  multiValueLabel: (base, { data }) => ({
    ...base,
    color: data.color,
    fontWeight: 500,
    fontSize: "0.78rem",
    paddingInline: 8,
    overflow: "visible",      // ✅ Đảm bảo chữ không bị crop
    whiteSpace: "nowrap",
  }),
  multiValueRemove: (base, { data }) => ({
    ...base,
    color: data.color,
    padding: "0px 7px",
    cursor: "pointer",
    transition: "background 0.2s ease, color 0.2s ease",
    ":hover": {
      backgroundColor: data.color,
      color: "#fff",
      borderRadius: 4,
    },
  }),
  option: (base, { isSelected, isFocused, data }) => ({
    ...base,
    backgroundColor: isSelected
      ? data.color
      : isFocused
      ? hexToRGBA(data.color, 0.2)
      : "transparent",
    color: data.color,
    fontWeight: isSelected ? 600 : 400,
    padding: "6px 12px",
    transition: "background 0.2s ease",
    ":active": {
      backgroundColor: data.color,
      color: "#fff",
    },
  }),
  control: (base) => ({
    ...base,
    borderRadius: 6,
    backgroundColor: "none",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 6,
    zIndex: 40,
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  }),
}


export default function ColorMultiSelect({
  value,
  onChange,
  options = defaultColorOptions,
  placeholder = "Select colors",
}: ColorMultiSelectProps) {
  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  const handleChange = (selected: MultiValue<ColorOption>) => {
    onChange(selected.map((opt) => opt.value))
  }

  return (
    <Select
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      isMulti
      placeholder={placeholder}
      closeMenuOnSelect={false}
      components={animatedComponents}
      styles={customStyles}
      className="text-sm"
    />
  )
}
