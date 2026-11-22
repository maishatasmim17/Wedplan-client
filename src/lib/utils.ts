import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://wedplan-server-pi.vercel.app/api";

// Local development must talk to the local API so new payment endpoints are used.
export const API_BASE_URL =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:5000/api"
    : configuredApiUrl;
