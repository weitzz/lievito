import { parseProductFilters } from "@/lib/product-filters"
import { getAllProducts, getProductsByIds } from "@/services/productService"

export async function GET(request: Request) {
    const url = new URL(request.url)
    const idsParam = url.searchParams.get("ids")
    let pizzas: Awaited<ReturnType<typeof getAllProducts>> | Awaited<ReturnType<typeof getProductsByIds>>

    if (idsParam !== null) {
        const ids = idsParam.split(",").map(Number)
        if (ids.length === 0 || ids.some(id => !Number.isInteger(id) || id <= 0)) {
            return Response.json([], { status: 200 })
        }
        pizzas = await getProductsByIds(ids)
    } else {
        pizzas = await getAllProducts(parseProductFilters(Object.fromEntries(url.searchParams.entries())))
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ""
    pizzas = pizzas.map((pizza) => {
        return {
            ...pizza,
            image: `${baseUrl}/pizzas/${pizza.image}`,
        };
    });
    return Response.json(pizzas, { status: 200 });
}
