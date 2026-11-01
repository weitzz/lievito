import { Prisma } from "@/generated/prisma";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | Prisma.Decimal) {
  return parseFloat(price.toString()).toLocaleString('pt-BR',
    { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export type FieldErrors = object | null

export function checkFieldError(fieldName: string, errors: FieldErrors): string | false {
  if (!errors || !(fieldName in errors)) return false
  const fieldErrors = (errors as Record<string, unknown>)[fieldName]
  return Array.isArray(fieldErrors) && typeof fieldErrors[0] === "string"
    ? fieldErrors[0]
    : false
}
