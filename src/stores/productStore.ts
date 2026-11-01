import type { ProductCardData } from "@/types/product-card"
import { create } from 'zustand'
type Store = {
    products: ProductCardData[];
    setProducts: (products: ProductCardData[]) => void;
}

export const useProducstStore = create<Store>((set) => ({
    products: [],
    setProducts: (products: ProductCardData[]) => set(state => {
        const merged = new Map<number, ProductCardData>(
            state.products.map(product => [product.id, product] as [number, ProductCardData])
        )
        products.forEach(product => merged.set(product.id, product))
        return { products: [...merged.values()] }
    }),
}))
