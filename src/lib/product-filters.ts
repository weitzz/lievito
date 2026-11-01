export const productCategories = [
  "Tradicionais",
  "Especiais",
  "Vegetarianas",
] as const

export type ProductCategory = (typeof productCategories)[number]
export type ProductSort = "name" | "price-asc" | "price-desc" | "popular"

export type ProductFilterParams = {
  q?: string | string[]
  category?: string | string[]
  vegetarian?: string | string[]
  minPrice?: string | string[]
  maxPrice?: string | string[]
  sort?: string | string[]
}

export type ProductFilters = {
  query?: string
  category?: ProductCategory
  vegetarian: boolean
  minPrice?: number
  maxPrice?: number
  sort: ProductSort
}

const firstValue = (value?: string | string[]) => Array.isArray(value) ? value[0] : value

const parsePrice = (value?: string | string[]) => {
  const normalizedValue = firstValue(value)
  if (!normalizedValue?.trim()) return undefined
  const price = Number(normalizedValue)
  return Number.isFinite(price) && price >= 0 ? price : undefined
}

export const parseProductFilters = (params: ProductFilterParams): ProductFilters => {
  const query = firstValue(params.q)?.trim().slice(0, 100)
  const categoryValue = firstValue(params.category)
  const sortValue = firstValue(params.sort)
  const category = productCategories.find((item) => item === categoryValue)
  const sort: ProductSort = ["price-asc", "price-desc", "popular"].includes(sortValue ?? "")
    ? sortValue as ProductSort
    : "name"

  return {
    query: query || undefined,
    category,
    vegetarian: firstValue(params.vegetarian) === "true",
    minPrice: parsePrice(params.minPrice),
    maxPrice: parsePrice(params.maxPrice),
    sort,
  }
}
