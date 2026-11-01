import type { PizzaConfiguration } from "@/lib/pizza-options"
import type { ProductSnapshot } from "@/types/product-card"

export type CartItem = {
    id: string
    productId: number
    quantity: number
    productSnapshot?: ProductSnapshot
} & PizzaConfiguration
