import Image from "next/image"
import Link from "next/link"
import { Bike, ChefHat, Leaf, Pizza } from "lucide-react"

const benefits = [
    { icon: Leaf, label: "Opções vegetarianas" },
    { icon: Pizza, label: "Três tamanhos de pizza" },
    { icon: ChefHat, label: "Bordas e adicionais" },
    { icon: Bike, label: "Entrega para sua casa" },
]

const categories = [
    { name: "Tradicionais", image: "/pizzas/calabresa.png", description: "Clássicos que todo mundo ama." },
    { name: "Especiais", image: "/pizzas/quatro-queijos.png", description: "Combinações para descobrir." },
    { name: "Vegetarianas", image: "/pizzas/vegetariana.png", description: "Mais cores e sabores à mesa." },
]

const HomeHighlights = () => (
    <>
        <section id="destaques" className="border-y border-border bg-accent/10">
            <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-7 md:grid-cols-4 md:py-9">
                {benefits.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-3 px-3 text-center text-sm font-medium text-foreground md:flex-row md:justify-center md:text-left">
                        <Icon aria-hidden="true" className="size-7 shrink-0 text-secondary" strokeWidth={1.7} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="mb-10 text-center md:mb-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Um sabor para cada ocasião</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">Nossas categorias</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
                {categories.map(category => (
                    <Link
                        key={category.name}
                        href={`/?category=${encodeURIComponent(category.name)}#cardapio`}
                        className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden bg-accent/20">
                            <Image
                                src={category.image}
                                alt={`Pizza da categoria ${category.name}`}
                                fill
                                sizes="(max-width: 640px) 100vw, 33vw"
                                className="object-cover transition duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3 p-5">
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary">{category.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                            </div>
                            <span aria-hidden="true" className="text-xl text-accent transition-transform group-hover:translate-x-1">→</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        <section id="sobre" className="scroll-mt-24 bg-primary text-primary-foreground">
            <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:py-24">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-accent/70">
                    <Image
                        src="/pizzas/pepperoni.png"
                        alt="Pizza artesanal servida para compartilhar"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Sobre a Lievito</p>
                    <h2 className="mt-3 font-serif text-3xl font-bold text-primary-foreground md:text-4xl">A paixão pela pizza artesanal</h2>
                    <p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/80">
                        Nosso cardápio reúne sabores clássicos, combinações especiais e opções vegetarianas para tornar cada encontro à mesa ainda mais gostoso.
                    </p>
                    <Link href="/#cardapio" className="mt-6 inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-primary-foreground">
                        Explore o cardápio <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </section>
    </>
)

export default HomeHighlights
