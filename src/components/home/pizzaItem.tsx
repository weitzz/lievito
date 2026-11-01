'use client'

import type { ProductCardData } from "@/types/product-card"
import Image from "next/image"
import { Button } from "../ui/button"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/stores/cartStore"
import {
    extraIngredients,
    getPizzaIngredients,
    getPizzaPriceInCents,
    pizzaCrusts,
    pizzaSizes,
    type ExtraIngredientId,
    type PizzaCrustId,
    type PizzaSizeId,
} from "@/lib/pizza-options"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ShoppingCart, Sparkles } from "lucide-react"

type Props = {
    data: ProductCardData
}

const PizzaItem = ({ data }: Props) => {
    const cart = useCartStore()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [size, setSize] = useState<PizzaSizeId>("medium")
    const [crust, setCrust] = useState<PizzaCrustId>("traditional")
    const [extras, setExtras] = useState<ExtraIngredientId[]>([])
    const [removedIngredients, setRemovedIngredients] = useState<string[]>([])
    const ingredients = getPizzaIngredients(data.ingredients)
    const configuration = { size, crust, extras, removedIngredients }
    const priceInCents = getPizzaPriceInCents(Number(data.price), configuration)
    const selectedSize = pizzaSizes.find(option => option.id === size)!
    const selectedCrust = pizzaCrusts.find(option => option.id === crust)!
    const selectedExtras = extraIngredients.filter(option => extras.includes(option.id))
    const startingPrice = getPizzaPriceInCents(Number(data.price), {
        size: "small",
        crust: "traditional",
        extras: [],
        removedIngredients: [],
    }) / 100

    const toggleExtra = (extraId: ExtraIngredientId) => {
        setExtras(current => current.includes(extraId)
            ? current.filter(id => id !== extraId)
            : [...current, extraId])
    }

    const toggleRemovedIngredient = (ingredient: string) => {
        setRemovedIngredients(current => current.includes(ingredient)
            ? current.filter(item => item !== ingredient)
            : [...current, ingredient])
    }

    const adjustmentLabel = (adjustmentInCents: number) => {
        if (adjustmentInCents === 0) return "incluída"
        const sign = adjustmentInCents > 0 ? "+" : "−"
        return `${sign} ${formatPrice(Math.abs(adjustmentInCents) / 100)}`
    }

    const handleAddToCart = () => {
        cart.addItem({
            id: crypto.randomUUID(),
            productId: data.id,
            quantity: 1,
            productSnapshot: {
                name: data.name,
                image: data.image,
                price: Number(data.price),
            },
            ...configuration,
        })
        setDialogOpen(false)
        cart.setOpen(true)
    }

    return (
        <>
            <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    className="relative block aspect-[6/5] w-full overflow-hidden bg-accent/10 text-left"
                    aria-label={`Ver detalhes de ${data.name}`}
                >
                    <Image
                        src={data.image}
                        alt={data.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
                        {data.category}
                    </span>
                    {data.vegetarian && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground shadow-sm">
                            <Sparkles className="size-3" /> Vegetariana
                        </span>
                    )}
                    {data.isTopSeller && (
                        <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                            Mais pedida
                        </span>
                    )}
                </button>

                <div className="p-3">
                    <h2 className="font-serif text-lg font-bold text-primary">{data.name}</h2>
                    <p className="mt-1 line-clamp-2 min-h-9 text-sm text-muted-foreground">
                        {data.ingredients}
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                        <div>
                            <span className="text-xs text-muted-foreground">A partir de</span>
                            <p className="font-bold text-primary">{formatPrice(startingPrice)}</p>
                        </div>
                        <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-2">
                            <ShoppingCart className="size-4" /> Personalizar
                        </Button>
                    </div>
                </div>
            </article>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-background sm:max-w-3xl">
                    <DialogHeader>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Personalize sua pizza</p>
                        <DialogTitle className="font-serif text-2xl">{data.name}</DialogTitle>
                        <DialogDescription>{data.ingredients}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 sm:grid-cols-[minmax(180px,0.8fr)_1.2fr]">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-accent/10">
                            <Image src={data.image} alt={data.name} fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover" />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-semibold">
                                Tamanho
                                <select value={size} onChange={event => setSize(event.target.value as PizzaSizeId)} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 font-normal text-foreground">
                                    {pizzaSizes.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label} ({adjustmentLabel(option.priceAdjustmentInCents)})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block text-sm font-semibold">
                                Borda
                                <select value={crust} onChange={event => setCrust(event.target.value as PizzaCrustId)} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 font-normal text-foreground">
                                    {pizzaCrusts.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label} ({adjustmentLabel(option.priceAdjustmentInCents)})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <fieldset>
                                <legend className="text-sm font-semibold">Adicionais</legend>
                                <div className="mt-2 space-y-2">
                                    {extraIngredients.map(extra => (
                                        <label key={extra.id} className="flex items-center justify-between gap-3 text-sm">
                                            <span className="flex items-center gap-2">
                                                <input type="checkbox" checked={extras.includes(extra.id)} onChange={() => toggleExtra(extra.id)} />
                                                {extra.label}
                                            </span>
                                            <span className="text-muted-foreground">+ {formatPrice(extra.priceAdjustmentInCents / 100)}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {ingredients.length > 0 && (
                                <fieldset>
                                    <legend className="text-sm font-semibold">Retirar ingredientes</legend>
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                        {ingredients.map(ingredient => (
                                            <label key={ingredient} className="flex items-center gap-2 text-sm">
                                                <input type="checkbox" checked={removedIngredients.includes(ingredient)} onChange={() => toggleRemovedIngredient(ingredient)} />
                                                {ingredient}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            )}

                            <div className="space-y-1 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground" aria-live="polite">
                                <div className="flex justify-between gap-2">
                                    <span>Pizza {selectedSize.label.toLowerCase()}</span>
                                    <span>{formatPrice((Math.round(Number(data.price) * 100) + selectedSize.priceAdjustmentInCents) / 100)}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span>Borda {selectedCrust.label.toLowerCase()}</span>
                                    <span>{adjustmentLabel(selectedCrust.priceAdjustmentInCents)}</span>
                                </div>
                                {selectedExtras.map(extra => (
                                    <div key={extra.id} className="flex justify-between gap-2">
                                        <span>{extra.label}</span>
                                        <span>+ {formatPrice(extra.priceAdjustmentInCents / 100)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between gap-2 border-t border-primary-foreground/30 pt-2 text-base font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(priceInCents / 100)}</span>
                                </div>
                            </div>

                            <Button onClick={handleAddToCart} className="w-full gap-2">
                                <ShoppingCart className="size-4" /> Adicionar ao carrinho · {formatPrice(priceInCents / 100)}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PizzaItem
