import Stripe from "stripe"
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const headersList = await headers()
    const stripeSignature = headersList.get('stripe-signature')
    const rawBody = await request.text()


    try {
        const event = stripe.webhooks.constructEvent(
            rawBody, stripeSignature!, process.env.STRIPE_WEBHOOK_KEY!
        )

        const eventTypes = [
            "checkout.session.completed",
            "checkout.session.async_payment_succeeded",

        ]

        if (eventTypes.includes(event.type)) {
            const session = event.data.object as Stripe.Checkout.Session
            const orderId = Number(session.metadata?.order_id)
            if (session.payment_status === "paid" && Number.isInteger(orderId) && orderId > 0) {
                await prisma.order.updateMany({
                    where: { id: orderId },
                    data: { status: "PAID" },
                })
            }
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido no webhook"
        console.error(error)
        return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
    }

    return NextResponse.json({})
}
