import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowRight, Check, Clock3, PackageCheck, Pizza, Truck } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/footer/footer"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { DELIVERY_FEE_IN_CENTS } from "@/lib/delivery"
import { prisma } from "@/lib/prisma"

const progressSteps = [
    { label: "Pagamento aprovado", icon: Check },
    { label: "Em preparo", icon: Pizza },
    { label: "Saiu para entrega", icon: Truck },
    { label: "Entregue", icon: PackageCheck },
]

const statusDetails = {
    INITIALIZED: { label: "Aguardando pagamento", stage: 0 },
    PAID: { label: "Pagamento aprovado", stage: 1 },
    IN_REVIEW: { label: "Em preparo", stage: 2 },
    SENT: { label: "Saiu para entrega", stage: 3 },
    DELIVERED: { label: "Pedido entregue", stage: 4 },
    CANCELED: { label: "Pedido cancelado", stage: -1 },
} as const

const OrdersPage = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const user = token
        ? await prisma.user.findFirst({ where: { token }, select: { id: true } })
        : null

    const orders = user
        ? await prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                orderProducts: {
                    include: { product: { select: { name: true } } },
                },
            },
        })
        : []

    return (
        <>
            <Header />
            <main className="min-h-[65vh] bg-background">
                <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Lievito · Pizzeria Artigianale</p>
                        <h1 className="mt-2 font-serif text-4xl font-bold text-primary">Seus pedidos</h1>
                        <p className="mt-2 text-muted-foreground">Acompanhe o pagamento e a entrega dos seus pedidos.</p>
                    </div>

                    {!user && (
                        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12">
                            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/20 text-primary">
                                <Clock3 className="size-6" />
                            </span>
                            <h2 className="mt-5 font-serif text-2xl font-bold text-primary">Entre na sua conta</h2>
                            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                                Faça login pelo cabeçalho para consultar seus pedidos e acompanhar cada etapa.
                            </p>
                            <Button asChild className="mt-6">
                                <Link href="/#home">Voltar para a loja</Link>
                            </Button>
                        </div>
                    )}

                    {user && orders.length === 0 && (
                        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12">
                            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/20 text-primary">
                                <Pizza className="size-6" />
                            </span>
                            <h2 className="mt-5 font-serif text-2xl font-bold text-primary">Você ainda não tem pedidos</h2>
                            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                                Escolha seus sabores favoritos e eles aparecerão aqui para você acompanhar.
                            </p>
                            <Button asChild className="mt-6 gap-2">
                                <Link href="/#cardapio">Ver cardápio <ArrowRight className="size-4" /></Link>
                            </Button>
                        </div>
                    )}

                    {user && orders.length > 0 && (
                        <div className="space-y-5">
                            {orders.map(order => {
                                const currentStatus = statusDetails[order.status]
                                const canceled = order.status === "CANCELED"
                                const orderNumber = `LV-${String(order.id).padStart(6, "0")}`
                                const orderDate = new Intl.DateTimeFormat("pt-BR", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                }).format(order.createdAt)
                                const subtotal = Number(order.subtotal)
                                const deliveryFee = DELIVERY_FEE_IN_CENTS / 100

                                return (
                                    <article key={order.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                                        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                                            <div>
                                                <p className="font-serif text-lg font-bold text-primary">Pedido {orderNumber}</p>
                                                <p className="mt-1 text-sm text-muted-foreground">Realizado em {orderDate}</p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${canceled ? "bg-primary/10 text-primary" : order.status === "INITIALIZED" ? "bg-accent/25 text-foreground" : "bg-secondary/15 text-secondary"}`}>
                                                {currentStatus.label}
                                            </span>
                                        </header>

                                        {!canceled && (
                                            <div className="grid grid-cols-2 gap-4 border-b border-border px-5 py-5 sm:grid-cols-4 sm:px-6">
                                                {progressSteps.map((step, index) => {
                                                    const complete = index < currentStatus.stage
                                                    const active = index === currentStatus.stage - 1
                                                    const Icon = step.icon
                                                    return (
                                                        <div key={step.label} className={`flex items-center gap-2 text-xs sm:flex-col sm:text-center ${complete || active ? "text-secondary" : "text-muted-foreground"}`}>
                                                            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${complete || active ? "bg-secondary text-secondary-foreground" : "bg-accent/20 text-muted-foreground"}`}>
                                                                <Icon className="size-4" />
                                                            </span>
                                                            <span>{step.label}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {canceled && (
                                            <p className="border-b border-border bg-primary/5 px-5 py-4 text-sm text-primary sm:px-6">
                                                Este pedido está cancelado.
                                            </p>
                                        )}

                                        <div className="grid gap-6 px-5 py-5 sm:grid-cols-[1fr_auto] sm:px-6">
                                            <div>
                                                <h2 className="mb-3 font-serif font-bold text-primary">Itens do pedido</h2>
                                                <ul className="space-y-3">
                                                    {order.orderProducts.map(item => (
                                                        <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
                                                            <div>
                                                                <p className="font-medium text-foreground">{item.product.name} <span className="text-muted-foreground">× {item.quantity}</span></p>
                                                                {item.customization && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.customization}</p>}
                                                            </div>
                                                            <span className="shrink-0 font-medium">{formatPrice(Number(item.price) * item.quantity)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="min-w-52 rounded-xl border border-border bg-background p-4 sm:w-60">
                                                <div className="flex justify-between gap-4 text-sm">
                                                    <span className="text-muted-foreground">Subtotal</span>
                                                    <span>{formatPrice(subtotal)}</span>
                                                </div>
                                                <div className="mt-2 flex justify-between gap-4 text-sm">
                                                    <span className="text-muted-foreground">Entrega</span>
                                                    <span>{formatPrice(deliveryFee)}</span>
                                                </div>
                                                <div className="mt-3 flex justify-between gap-4 border-t border-border pt-3 font-serif font-bold text-primary">
                                                    <span>Total</span>
                                                    <span>{formatPrice(subtotal + deliveryFee)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    )
}

export default OrdersPage
