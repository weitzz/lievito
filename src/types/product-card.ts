export type ProductCardData = {
    id: number
    name: string
    image: string
    price: string | number
    ingredients: string | null
    category: string
    vegetarian: boolean
    salesCount?: number
    isTopSeller?: boolean
}

export type ProductSnapshot = Pick<ProductCardData, "name" | "image" | "price">
