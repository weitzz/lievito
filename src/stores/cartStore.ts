import { CartItem } from "@/types/cart-item";
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Store = {
    open: boolean
    items: CartItem[]
    hasHydrated: boolean
    setOpen: (open: boolean) => void
    setHasHydrated: (hasHydrated: boolean) => void
    addItem: (item: CartItem) => void
    changeQuantity: (id: string, amount: number) => void
    setQuantity: (id: string, quantity: number) => void
    removeItem: (id: string) => void
    clearCart: () => void
}

export const useCartStore = create<Store>()(
    persist(
        (set) => ({
            open: false,
            items: [],
            hasHydrated: false,
            setOpen: (open) => set(state => ({ ...state, open })),
            setHasHydrated: (hasHydrated) => set(state => ({ ...state, hasHydrated })),
            addItem: (item) => set(state => ({ ...state, items: [...state.items, item] })),
            changeQuantity: (id, amount) => set(state => ({
                ...state,
                items: state.items
                    .map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
                    .filter(item => item.quantity > 0)
            })),
            setQuantity: (id, quantity) => {
                if (!Number.isInteger(quantity) || quantity < 1) return
                set(state => ({
                    ...state,
                    items: state.items.map(item => item.id === id ? { ...item, quantity } : item)
                }))
            },
            removeItem: (id) => set(state => ({
                ...state,
                items: state.items.filter(item => item.id !== id)
            })),
            clearCart: () => set(state => ({ ...state, items: [] })),
        }),
        {
            name: 'tw-pizzas-cart',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items }),
            skipHydration: true,
            onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
        }
    )
)
