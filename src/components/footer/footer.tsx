import Link from "next/link"
import LievitoLogo from "../layout/lievitoLogo"

const Footer = () => (
    <footer id="contato" className="scroll-mt-20 border-t border-primary/20 bg-primary text-primary-foreground">
        <div className="container mx-auto grid gap-8 px-4 py-10 sm:grid-cols-2 sm:items-center">
            <div className="flex flex-col items-center gap-4 sm:items-start">
                <LievitoLogo className="w-44 rounded-md" />
                <p className="max-w-sm text-center text-sm text-primary-foreground/75 sm:text-left">
                    Pizzeria artigianale. Uma boa pizza reúne todo mundo à mesa.
                </p>
            </div>
            <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm sm:justify-end">
                <Link href="/#home" className="transition-colors hover:text-accent">Início</Link>
                <Link href="/#cardapio" className="transition-colors hover:text-accent">Cardápio</Link>
                <Link href="/#sobre" className="transition-colors hover:text-accent">Sobre nós</Link>
            </nav>
        </div>
        <div className="border-t border-primary-foreground/20 px-4 py-4 text-center text-xs text-primary-foreground/70">
            © {new Date().getFullYear()} Lievito Pizzeria Artigianale. Todos os direitos reservados.
        </div>
    </footer>
)

export default Footer
