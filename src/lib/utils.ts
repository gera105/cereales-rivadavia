// ✅ src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina y optimiza clases CSS.
 * Ejemplo: cn("bg-red-500", condicion && "text-white")
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
