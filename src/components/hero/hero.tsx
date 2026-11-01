import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf } from "lucide-react"
import { Button } from "../ui/button"

const Hero = () => (
    <section id="home" className="relative overflow-hidden bg-background">
        <div className="container mx-auto grid items-center gap-12 px-4 py-16 md:grid-cols-2 md:gap-16 md:py-24">
            <div className="relative z-10 max-w-xl md:py-8">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                    <Leaf className="size-4 text-secondary" /> Pizzeria artigianale
                </span>
                <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.05] text-primary sm:text-6xl lg:text-7xl">
                    A arte da <span className="italic text-secondary">verdadeira pizza.</span>
                </h1>
                <p className="mt-6 max-w-md text-base leading-8 text-foreground/80 sm:text-lg">
                    Sabores feitos para reunir à mesa. Escolha sua pizza favorita e monte do seu jeito.
                </p>
                <Button asChild className="mt-9 gap-3 px-6 py-6 shadow-sm">
                    <Link href="/#cardapio">
                        Conheça nosso cardápio <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-[680px] overflow-hidden rounded-sm bg-accent/20">
                <Image
                    src="/pizzas/margherita.png"
                    alt="Pizza artesanal de tomate e manjericão"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover"
                />
                <span className="absolute bottom-4 left-4 bg-background/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm sm:bottom-6 sm:left-6">
                    Fermentação lenta · feita à mão
                </span>
            </div>
        </div>
    </section>
)

export default Hero
