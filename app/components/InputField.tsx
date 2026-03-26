"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: "number" | "text";
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  unit?: string;
  icon?: ReactNode;
  required?: boolean;
  hint?: string;
  as?: "select";
  options?: { value: string; label: string }[];
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
  placeholder,
  unit,
  icon,
  required,
  hint,
  as,
  options,
}: InputFieldProps) {
  return (
    <motion.div
      className="flex flex-col gap-1.5 group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {as === "select" ? (
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-[#0d1421] border border-gray-700 text-gray-200 rounded-xl px-4 py-3
              focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
              transition-all duration-200 appearance-none cursor-pointer text-sm"
          >
            {options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            ▾
          </span>
        </div>
      ) : (
        <div className="relative">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            required={required}
            className="w-full bg-[#0d1421] border border-gray-700 text-gray-200 rounded-xl px-4 py-3
              focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
              transition-all duration-200 placeholder-gray-600 text-sm
              group-hover:border-gray-600"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono pointer-events-none">
              {unit}
            </span>
          )}
        </div>
      )}

      {hint && (
        <p className="text-[10px] text-gray-600 mt-0.5 pl-1">{hint}</p>
      )}
    </motion.div>
  );
}