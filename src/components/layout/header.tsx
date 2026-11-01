import Link from 'next/link'
import CartButton from '../cart/cartButton'
import LoginButton from '../login/loginButton'
import { cookies } from 'next/headers'
import { Search } from "lucide-react"
import LievitoLogo from './lievitoLogo'


async function Header() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 text-foreground backdrop-blur">
      <div className="container mx-auto flex min-h-20 flex-wrap items-center justify-between gap-x-8 px-4 py-3">
        <Link href="/#home" aria-label="Lievito Pizzeria Artigianale, início">
          <LievitoLogo />
        </Link>
        <nav aria-label="Navegação principal" className="order-3 flex w-full items-center justify-center gap-5 overflow-x-auto pb-1 text-sm font-medium sm:order-none sm:w-auto sm:pb-0">
          <Link href="/#home" className="transition-colors hover:text-primary">Início</Link>
          <Link href="/#cardapio" className="transition-colors hover:text-primary">Cardápio</Link>
          <Link href="/#sobre" className="transition-colors hover:text-primary">Sobre nós</Link>
          <Link href="/#contato" className="transition-colors hover:text-primary">Contato</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/#cardapio" aria-label="Buscar pizzas" className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-primary transition-colors hover:bg-accent hover:text-accent-foreground">
            <Search className="size-4" />
          </Link>
          <div className="flex items-center gap-2">
            <LoginButton initialState={Boolean(token)} />
          </div>
        <CartButton />
        </div>
      </div>
    </header>
  )
}


export default Header
