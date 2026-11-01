import { prisma } from "@/lib/prisma"
import {
    ExtraIngredientId,
    getPizzaConfigurationDescription,
    getPizzaIngredients,
    getPizzaPriceInCents,
    isExtraIngredientId,
    isPizzaCrustId,
    isPizzaSizeId,
    PizzaCrustId,
    PizzaSizeId,
} from "@/lib/pizza-options"
import { MINIMUM_DELIVERY_IN_CENTS } from "@/lib/delivery"

export class MinimumDeliveryError extends Error {
    constructor() {
        super("O valor mínimo para entrega não foi atingido")
        this.name = "MinimumDeliveryError"
    }
}

export const createNewOrder = async (userId: number, cart: unknown) => {
    if (!Array.isArray(cart) || cart.length === 0) return null

    const orderProducts: {
        productId: number
        price: number
        quantity: number
        customization: string
    }[] = []
    let subtotalInCents = 0

    for (const rawItem of cart) {
        if (typeof rawItem !== "object" || rawItem === null) return null
        const item = rawItem as Record<string, unknown>
        if (!Number.isInteger(item.productId) || Number(item.productId) <= 0) return null
        if (!Number.isInteger(item.quantity) || Number(item.quantity) <= 0) return null
        if (!isPizzaSizeId(item.size) || !isPizzaCrustId(item.crust)) return null
        if (!Array.isArray(item.extras) || !item.extras.every(isExtraIngredientId)) return null
        if (!Array.isArray(item.removedIngredients) || !item.removedIngredients.every(value => typeof value === "string")) return null

        const product = await prisma.product.findUnique({
            where: { id: Number(item.productId) }
        })

        if (!product) return null

        const availableIngredients = getPizzaIngredients(product.ingredients)
        const removedIngredients = [...new Set(item.removedIngredients as string[])]
        if (removedIngredients.some(ingredient => !availableIngredients.includes(ingredient))) return null

        const extras = [...new Set(item.extras as ExtraIngredientId[])]
        const configuration = {
            size: item.size as PizzaSizeId,
            crust: item.crust as PizzaCrustId,
            extras,
            removedIngredients,
        }
        const priceInCents = getPizzaPriceInCents(Number(product.price), configuration)
        if (priceInCents <= 0) return null

        orderProducts.push({
            productId: product.id,
            price: priceInCents / 100,
            quantity: Number(item.quantity),
            customization: getPizzaConfigurationDescription(configuration),
        })
        subtotalInCents += priceInCents * Number(item.quantity)

    }

    if (subtotalInCents < MINIMUM_DELIVERY_IN_CENTS) throw new MinimumDeliveryError()

    const newOrder = await prisma.order.create({
        data: {
            userId,
            subtotal: subtotalInCents / 100,
            orderProducts: {
                createMany: {
                    data: orderProducts
                }
            }
        },
        include: {
            orderProducts: {
                select: {
                    quantity: true, price: true, customization: true,
                    product: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }

    })

    return newOrder

}
