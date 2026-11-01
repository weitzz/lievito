import { stripe } from "@/lib/stripe";
import { getLoggedUserFromHeader } from "@/services/authService";
import { createNewOrder, MinimumDeliveryError } from "@/services/orderService";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { DELIVERY_FEE_IN_CENTS, MINIMUM_DELIVERY_IN_CENTS } from "@/lib/delivery";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const headerList = await headers()
    const origin = headerList.get('origin')
    const body = await request.json().catch(() => null) as { cart?: unknown } | null
    const cart = body?.cart
    const loggedUser = await getLoggedUserFromHeader()
    if (!loggedUser) return NextResponse.json({ error: "Usuário não logado" }, { status: 401 })
    if (!Array.isArray(cart) || cart.length === 0) {
        return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    let order: Awaited<ReturnType<typeof createNewOrder>>
    try {
        order = await createNewOrder(loggedUser.id, cart)
    } catch (error) {
        if (error instanceof MinimumDeliveryError) {
            return NextResponse.json({
                error: `O pedido mínimo para entrega é ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(MINIMUM_DELIVERY_IN_CENTS / 100)}`,
            }, { status: 400 })
        }
        console.error("[order/new] Failed to save the order", error)
        return NextResponse.json({ error: "Não foi possível salvar o pedido. Tente novamente." }, { status: 500 })
    }
    if (!order) return NextResponse.json({ error: "Itens ou opções inválidas" }, { status: 400 })
    const paymentItems = []
    for (let item of order.orderProducts) {
        paymentItems.push({
            price_data: {
                currency: "BRL", unit_amount: Math.round(Number(item.price) * 100), product_data: {
                    name: `${item.product.name} (${item.customization})`,
                }
            },
            quantity: item.quantity
        })
    }

    let paymentSession: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>
    try {
        paymentSession = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}`,
            line_items: paymentItems,
            customer_email: loggedUser.email,
            shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', display_name: "Frete Fixo", fixed_amount: { currency: "BRL", amount: DELIVERY_FEE_IN_CENTS } } }],
            metadata: { order_id: order.id }
        })
    } catch (error) {
        console.error(`[order/new] Failed to create Stripe checkout for order ${order.id}`, error)
        await prisma.order.updateMany({
            where: { id: order.id, status: "INITIALIZED" },
            data: { status: "CANCELED" },
        }).catch(updateError => console.error(`[order/new] Failed to cancel order ${order.id}`, updateError))
        return NextResponse.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 502 })
    }


    return NextResponse.json({ order, url: paymentSession.url }, { status: 201 })
}
