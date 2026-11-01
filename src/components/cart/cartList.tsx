'use client'

import { useState } from "react"
import { useCartStore } from "@/stores/cartStore"
import { useProducstStore } from "@/stores/productStore"
import { Button } from "../ui/button"
import CartProduct from "./cartProduct"
import { formatPrice } from "@/lib/utils"
import { useAuthStore } from "@/stores/authStore"
import { apiWithAuth } from "@/lib/axios"
import { getPizzaPriceInCents } from "@/lib/pizza-options"
import { DELIVERY_FEE_IN_CENTS, MINIMUM_DELIVERY_IN_CENTS } from "@/lib/delivery"


const CartList = () => {
    const auth = useAuthStore()
    const cart = useCartStore()
    const products = useProducstStore()
    const [checkoutError, setCheckoutError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const subtotalInCents = cart.items.reduce((subtotal, item) => {
        const product = products.products.find(product => product.id === item.productId)
        const basePrice = product?.price ?? item.productSnapshot?.price
        if (basePrice === undefined) return subtotal
        return subtotal + getPizzaPriceInCents(Number(basePrice), item) * item.quantity
    }, 0)
    const subtotal = subtotalInCents / 100
    const shippingCost = DELIVERY_FEE_IN_CENTS / 100
    const minimumNotReached = subtotalInCents < MINIMUM_DELIVERY_IN_CENTS
    const amountToMinimum = Math.max(MINIMUM_DELIVERY_IN_CENTS - subtotalInCents, 0) / 100

    const handleFinish = async () => {
        if (cart.items.length === 0 || isSubmitting) return
        setCheckoutError(null)
        setIsSubmitting(true)

        try {
            const orderReq = await apiWithAuth.post('/order/new', {
                cart: cart.items
            })

            if (orderReq.status !== 201 || !orderReq.data?.url) {
                throw new Error("Não foi possível iniciar o pagamento. Tente novamente.")
            }
            window.location.href = orderReq.data.url
        } catch (error) {
            const responseError = error as { response?: { data?: { error?: unknown } } }
            const message = responseError.response?.data?.error
            setCheckoutError(typeof message === "string"
                ? message
                : "Não foi possível finalizar a compra. Verifique sua conexão e tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <div className="my-3 flex justify-end border-b border-border pb-2">
                <Button variant="ghost" onClick={cart.clearCart} className="text-destructive hover:text-destructive/80">
                    Limpar carrinho
                </Button>
            </div>
            <div className="flex flex-col gap-3 my-5">
                {cart.items.map(item => (
                    <CartProduct key={item.id} data={item} />
                ))}
                <div className="my-2 space-y-2 rounded-lg border border-border bg-card p-4 text-right">
                    <p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></p>
                    <p className="flex justify-between"><span>Entrega</span><span>{formatPrice(shippingCost)}</span></p>
                    <p className="flex justify-between border-t border-border pt-2 font-serif text-lg font-bold text-primary"><span>Total</span><span>{formatPrice(subtotal + shippingCost)}</span></p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Pedido mínimo para entrega: {formatPrice(MINIMUM_DELIVERY_IN_CENTS / 100)}
                </p>
                {minimumNotReached && (
                    <p role="status" className="text-sm font-medium text-destructive">
                        Adicione mais {formatPrice(amountToMinimum)} para atingir o mínimo de entrega.
                    </p>
                )}
                {checkoutError && (
                    <p role="alert" className="rounded-lg border border-destructive/30 bg-primary/5 p-3 text-sm text-destructive">
                        {checkoutError}
                    </p>
                )}

            </div>
            {auth.token &&
                <Button
                    onClick={handleFinish}
                    disabled={minimumNotReached || isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? "Preparando pagamento…" : "Finalizar Compra"}
                </Button>
            }
            {!auth.token &&
                <Button onClick={() => auth.setOpen(true)}>Login / Cadastro</Button>
            }

        </>
    )
}

export default CartList
