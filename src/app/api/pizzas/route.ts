import { getAllProducts } from "@/services/productService";

export async function GET() {
    let pizzas = await getAllProducts();
    pizzas = pizzas.map((pizza) => {
        return {
            ...pizza,
            image: `${process.env.NEXT_PUBLIC_BASE_URL}/pizzas/${pizza.image}`,
        };
    });
    return new Response(JSON.stringify(pizzas), { status: 200 });
}
