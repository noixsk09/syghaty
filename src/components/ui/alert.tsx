import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Alert({
  className,
  variant = "info",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: "info" | "error" | "success" | "warning" }) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variant === "info" && "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--navy)]",
        variant === "error" && "border-red-200 bg-red-50 text-red-800",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
        className,
      )}
      {...props}
    />
  );
}
