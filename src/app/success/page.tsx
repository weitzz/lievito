import Header from "@/components/layout/header";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { Check, ArrowRight, PackageCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Success({ searchParams }: Props) {
    const sessionId = (await searchParams).session_id as string

    if (!sessionId) return redirect('/')
    const paymentSession = await stripe.checkout.sessions.retrieve(sessionId)
    if (!paymentSession) return redirect('/')
    const customerEmail = paymentSession.customer_email


    return (
        <div>
            <Header />
            <main className="container mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-4 py-16">
                <section className="w-full rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12">
                    <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Check className="size-8" />
                    </span>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Pagamento aprovado</p>
                    <h1 className="mt-2 font-serif text-3xl font-bold text-primary">Seu pedido está confirmado</h1>
                    <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                        Enviaremos os próximos detalhes para <strong className="text-foreground">{customerEmail}</strong>.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button asChild className="gap-2">
                            <Link href="/pedidos">Acompanhar pedido <PackageCheck className="size-4" /></Link>
                        </Button>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/#cardapio">Continuar comprando <ArrowRight className="size-4" /></Link>
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    );
}
