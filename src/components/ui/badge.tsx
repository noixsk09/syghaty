import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-[var(--gold-soft)] px-2 py-0.5 text-xs font-medium text-[var(--navy)]",
        className,
      )}
      {...props}
    />
  );
}
