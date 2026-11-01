import Link from "next/link"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { productCategories } from "@/lib/product-filters"

export type SearchParams = Record<string, string | string[] | undefined>

type Props = {
    searchParams: SearchParams
}

const firstValue = (value?: string | string[]) => Array.isArray(value) ? value[0] : value

const SearchInput = ({ searchParams }: Props) => {
    const query = firstValue(searchParams.q) ?? ""
    const category = firstValue(searchParams.category) ?? ""
    const minPrice = firstValue(searchParams.minPrice) ?? ""
    const maxPrice = firstValue(searchParams.maxPrice) ?? ""
    const sort = firstValue(searchParams.sort) ?? "name"
    const vegetarian = firstValue(searchParams.vegetarian) === "true"

    return (
        <form action="/" method="get" className="mx-auto grid max-w-5xl gap-4 rounded-xl border border-border bg-card p-5 text-left text-foreground shadow-sm md:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium">
                Buscar por sabor
                <Input
                    type="search"
                    name="q"
                    placeholder="Ex.: Margherita"
                    defaultValue={query}
                    className="mt-1 bg-background text-foreground"
                />
            </label>

            <label className="text-sm font-medium">
                Categoria
                <select name="category" defaultValue={category} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-foreground">
                    <option value="">Todas as categorias</option>
                    {productCategories.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </label>

            <div className="text-sm font-medium">
                Faixa de preço da média
                <div className="mt-1 flex gap-2">
                    <Input
                        type="number"
                        name="minPrice"
                        min="0"
                        step="0.01"
                        placeholder="Mínimo"
                        defaultValue={minPrice}
                        className="bg-background text-foreground"
                        aria-label="Preço mínimo"
                    />
                    <Input
                        type="number"
                        name="maxPrice"
                        min="0"
                        step="0.01"
                        placeholder="Máximo"
                        defaultValue={maxPrice}
                        className="bg-background text-foreground"
                        aria-label="Preço máximo"
                    />
                </div>
            </div>

            <label className="text-sm font-medium">
                Ordenar por
                <select name="sort" defaultValue={sort} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-foreground">
                    <option value="name">Nome</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                    <option value="popular">Mais vendidos</option>
                </select>
            </label>

            <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="vegetarian" value="true" defaultChecked={vegetarian} />
                Somente vegetarianas
            </label>

            <div className="flex items-center gap-3 md:col-span-2 lg:col-span-3 lg:justify-end">
                <Link href="/" className="text-sm underline underline-offset-4 hover:text-accent">Limpar filtros</Link>
                <Button type="submit">Filtrar pizzas</Button>
            </div>
        </form>
    )
}

export default SearchInput
