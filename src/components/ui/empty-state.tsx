import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-12 text-center",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-[var(--navy)]">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
