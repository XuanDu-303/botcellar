"use client"

import Select, { MultiValue, StylesConfig } from "react-select"
import makeAnimated from "react-select/animated"

type Option = {
  label: string
  value: string
}

interface ComboboxMultiProps {
  options: Option[]
  placeholder?: string
  value: string[]
  onChange: (value: string[]) => void
  className?: string
}

const animatedComponents = makeAnimated()

const customStyles: StylesConfig<Option, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "none",
    borderRadius: 6,
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // Tailwind blue-500 / gray-300
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
    "&:hover": {
      borderColor: "#9ca3af", // gray-400
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#d1d5db", // gray-100
    borderRadius: 4,
    display: "flex",
    justifyContent: "space-between",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#111827", // gray-900
    fontSize: "0.8rem",
    overflow: "visible",  
    paddingInline: 8,
    fontWeight: 500,    // ✅ Đảm bảo chữ không bị crop
    whiteSpace: "nowrap",
    padding: "3px 0px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#111827", // gray-500
    padding: "0px 7px",
    cursor: "pointer",
    transition: "background 0.2s ease, color 0.2s ease",
    ":hover": {
      backgroundColor: "#ef4444", // red-500
      color: "white",
      borderRadius: 4,
    },
  }),
  
  option: (base, { isSelected }) => ({
    ...base,
    color: "black",
    fontWeight: isSelected ? 600 : 400,
    padding: "6px 12px",
    fontSize: "0.9rem",
  }),
}

export default function ComboboxMulti({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: ComboboxMultiProps) {
  const selected = options.filter((opt) => value.includes(opt.value))

  const handleChange = (selectedOptions: MultiValue<Option>) => {
    onChange(selectedOptions.map((opt) => opt.value))
  }

  return (
    <Select
      isMulti
      options={options}
      value={selected}
      onChange={handleChange}
      closeMenuOnSelect={false}
      placeholder={placeholder}
      components={animatedComponents}
      styles={customStyles}
      className={className}
    />
  )
}
