import React from "react";
import { cn } from "@/shared/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide border",
          variant === "success" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          variant === "warning" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
          variant === "error" && "bg-red-500/10 text-red-400 border-red-500/20",
          variant === "info" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
          variant === "neutral" && "bg-neutral-800 text-neutral-400 border-neutral-700",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
