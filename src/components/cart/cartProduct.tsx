'use client'

import { formatPrice } from "@/lib/utils"
import { useProducstStore } from "@/stores/productStore"
import { CartItem } from "@/types/cart-item"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { useCartStore } from "@/stores/cartStore"
import { useEffect, useState } from "react"
import {
    extraIngredients,
    getPizzaPriceInCents,
    pizzaCrusts,
    pizzaSizes,
} from "@/lib/pizza-options"
type Props = {
    data: CartItem
}

const CartProduct = ({ data }: Props) => {
    const cart = useCartStore()
    const products = useProducstStore()
    const [quantityInput, setQuantityInput] = useState(String(data.quantity))
    useEffect(() => setQuantityInput(String(data.quantity)), [data.quantity])

    const product = products.products.find(item => item.id === data.productId)
        ?? (data.productSnapshot ? { id: data.productId, ...data.productSnapshot } : null)
    if (!product) return null
    const size = pizzaSizes.find(option => option.id === data.size)
    const crust = pizzaCrusts.find(option => option.id === data.crust)
    const extras = data.extras
        .map(id => extraIngredients.find(option => option.id === id)?.label)
        .filter(Boolean)
    const unitPrice = getPizzaPriceInCents(Number(product.price), data) / 100

  return (
      <div className="flex items-start gap-3 border-b pb-3">
          <div className="w-12 shrink-0">
              <Image src={product.image} alt={product.name} width={100} height={100} className="w-full"/>
          </div>
          <div className="min-w-0 flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">{size?.label} · Borda {crust?.label}</p>
              {extras.length > 0 && <p className="text-sm text-muted-foreground">Extras: {extras.join(", ")}</p>}
              {data.removedIngredients.length > 0 && (
                  <p className="text-sm text-muted-foreground">Sem: {data.removedIngredients.join(", ")}</p>
              )}
              <p className="text-sm">{formatPrice(unitPrice)} cada</p>
              <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => cart.removeItem(data.id)}
                  className="mt-1 h-auto px-1 py-1 text-destructive hover:text-destructive/80"
                  aria-label={`Excluir ${product.name} do carrinho`}
              >
                  <Trash2 className="size-4" /> Excluir
              </Button>
          </div>
          <div className="flex shrink-0 items-center rounded-md bg-secondary p-1 text-secondary-foreground">
              <Button size="sm" variant="ghost" onClick={() => cart.changeQuantity(data.id, -1)} className="cursor-pointer" aria-label="Diminuir quantidade">
                  <i className="ri-subtract-line text-xl"></i>
              </Button>
              <input
                  type="number"
                  min={1}
                  step={1}
                  value={quantityInput}
                  onChange={event => {
                      const value = event.target.value
                      setQuantityInput(value)
                      const quantity = Number(value)
                      if (Number.isInteger(quantity) && quantity >= 1) {
                          cart.setQuantity(data.id, quantity)
                      }
                  }}
                  onBlur={() => {
                      const quantity = Number(quantityInput)
                      if (!Number.isInteger(quantity) || quantity < 1) {
                          setQuantityInput(String(data.quantity))
                      }
                  }}
                  className="w-12 bg-transparent text-center outline-none"
                  aria-label={`Quantidade de ${product.name}`}
              />
              <Button size="sm" variant="ghost" onClick={() => cart.changeQuantity(data.id, 1)} className="cursor-pointer" aria-label="Aumentar quantidade">
                  <i className="ri-add-line text-xl"></i>
              </Button>
          </div>
      </div>
  )
}

export default CartProduct
