import React, { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, containerClassName, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("flex flex-col gap-2 w-full", containerClassName)}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-neutral-300">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            id={id}
            type={resolvedType}
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-[#0B0B0B] px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all",
              "focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20",
              isPassword ? "pr-10" : "pr-4",
              error ? "border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20" : "border-neutral-800",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 shrink-0" />
              ) : (
                <Eye className="h-4 w-4 shrink-0" />
              )}
            </button>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-400 font-medium tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
