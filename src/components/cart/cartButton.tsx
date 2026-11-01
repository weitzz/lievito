'use client'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '../ui/button'
import { ShoppingCart } from "lucide-react"


const CartButton = () => {
  const setOpen = useCartStore(state => state.setOpen)
  const items = useCartStore(state => state.items)
  const hasHydrated = useCartStore(state => state.hasHydrated)
  const quantity = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button
      size="icon"
      onClick={() => setOpen(true)}
      aria-label={`Abrir carrinho${hasHydrated && quantity > 0 ? `, ${quantity} itens` : ""}`}
      className="relative border border-border bg-background text-primary hover:bg-accent hover:text-accent-foreground"
    >
      <ShoppingCart className="size-4" />
      {hasHydrated && quantity > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground"
        >
          {quantity}
        </span>
      )}
    </Button>
  )
}

export default CartButton
