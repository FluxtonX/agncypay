import React from "react";
import { cn } from "@/shared/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, containerClassName, id, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-2 w-full", containerClassName)}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-neutral-300">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={id}
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-[#0B0B0B] px-4 py-3 text-sm text-white transition-all appearance-none cursor-pointer",
              "focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20",
              error ? "border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20" : "border-neutral-800",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-black text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            <svg
              className="h-4 w-4 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-red-400 font-medium tracking-wide">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
