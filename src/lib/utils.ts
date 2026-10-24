import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateEg(
  value: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}

export function formatMoneyEg(amount: number | null | undefined, currency = "EGP") {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
