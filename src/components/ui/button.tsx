import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--navy)] text-white hover:bg-[var(--navy-600)] focus-visible:ring-[var(--gold)]",
  secondary:
    "bg-[var(--gold-soft)] text-[var(--navy)] hover:bg-[var(--gold)]/30 focus-visible:ring-[var(--navy)]",
  ghost: "bg-transparent text-[var(--navy)] hover:bg-[var(--navy)]/5",
  danger: "bg-red-700 text-white hover:bg-red-800",
  outline:
    "border border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--surface-muted)]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          size === "sm" && "h-9 px-3 text-sm",
          size === "md" && "h-11 px-4 text-sm",
          size === "lg" && "h-12 px-5 text-base",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
