import SearchInput from '../search/searchInput'
import PizzaList from './pizzaList'
import { getAllProducts } from '@/services/productService'
import { parseProductFilters } from '@/lib/product-filters'
import type { SearchParams } from '../search/searchInput'
import type { ProductCardData } from '@/types/product-card'

type Props = {
    searchParams: SearchParams
}

const Menu = async ({ searchParams }: Props) => {
    const filters = parseProductFilters(searchParams)
    const products = await getAllProducts(filters)
    const pizzas: ProductCardData[] = products.map(pizza => ({
        id: pizza.id,
        name: pizza.name,
        image: `/pizzas/${pizza.image}`,
        price: pizza.price.toString(),
        ingredients: pizza.ingredients,
        category: pizza.category,
        vegetarian: pizza.vegetarian,
        salesCount: pizza.salesCount,
        isTopSeller: pizza.isTopSeller,
    }))

    return (
        <>
            <section id="cardapio" className="scroll-mt-24 border-y border-border bg-card px-4 py-16 text-center md:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Pizzas feitas para compartilhar</p>
                <h1 className="mb-3 mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">Nosso cardápio</h1>
                <p className="mb-7 text-muted-foreground">Escolha um sabor, personalize e aproveite.</p>
                <SearchInput searchParams={searchParams} />
            </section>
            {pizzas.length > 0 ? (
                <PizzaList pizzas={pizzas} />
            ) : (
                <p className="container mx-auto px-4 py-12 text-center text-muted-foreground">
                    Nenhuma pizza encontrada com esses filtros.
                </p>
            )}
        </>
    )
}

export default Menu
