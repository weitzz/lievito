'use client'
import PizzaItem from "./pizzaItem"
import { useProducstStore } from "@/stores/productStore"
import { useEffect } from "react"
import type { ProductCardData } from "@/types/product-card"

type PizzaProps = {
  pizzas: ProductCardData[]
}
const PizzaList = ({ pizzas }: PizzaProps) => {
  const setProducts = useProducstStore(state => state.setProducts)
  useEffect(() => setProducts(pizzas), [pizzas, setProducts])
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pt-10 pb-20 sm:grid-cols-2">
      {pizzas.map(pizza => (
        <PizzaItem
          key={pizza.id}
          data={pizza}
        />
      ))}
    </section>
  )
}

export default PizzaList
