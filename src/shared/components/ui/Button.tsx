import React from "react";
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold tracking-wide transition-all outline-none cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]",
          // Variants
          variant === "primary" && "bg-white text-black hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
          variant === "secondary" && "bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-700",
          variant === "outline" && "border border-neutral-700 text-white bg-transparent hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-neutral-600",
          variant === "ghost" && "text-[#A3A3A3] hover:text-white bg-transparent hover:bg-white/5",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
