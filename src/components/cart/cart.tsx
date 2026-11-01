'use client'
import { useCartStore } from "@/stores/cartStore"
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer"
import { useEffect } from "react"
import CartEmpty from "./cartEmpty"
import CartList from "./cartList"
import { useProducstStore } from "@/stores/productStore"
import { api } from "@/lib/axios"

const Cart = () => {
    const open = useCartStore(state => state.open)
    const items = useCartStore(state => state.items)
    const hasHydrated = useCartStore(state => state.hasHydrated)
    const setOpen = useCartStore(state => state.setOpen)
    const products = useProducstStore(state => state.products)
    const setProducts = useProducstStore(state => state.setProducts)
    const missingIds = [...new Set(items
        .filter(item => !item.productSnapshot && !products.some(product => product.id === item.productId))
        .map(item => item.productId))]
    const missingIdsKey = missingIds.join(",")

    useEffect(() => {
        useCartStore.persist.rehydrate()
    }, [])

    useEffect(() => {
        if (!hasHydrated || !missingIdsKey) return
        let cancelled = false
        api.get("/pizzas", { params: { ids: missingIdsKey } })
            .then(response => {
                if (!cancelled) setProducts(response.data)
            })
            .catch(() => undefined)

        return () => { cancelled = true }
    }, [hasHydrated, missingIdsKey, setProducts])

  return (
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
          <DrawerContent className="border-l border-border bg-background p-5">
              <DrawerTitle className="font-serif text-2xl">Seu carrinho</DrawerTitle>
              {items.length <= 0 && <CartEmpty />}
              {items.length > 0 && <CartList/>}
          </DrawerContent>
    </Drawer>
  )
}

export default Cart
