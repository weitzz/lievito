import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/lib/prisma"
import type { ProductFilters } from "@/lib/product-filters"

export const getAllProducts = async (filters: ProductFilters) => {
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
        return []
    }

    const where: Prisma.ProductWhereInput = {}
    if (filters.query) where.name = { contains: filters.query, mode: "insensitive" }
    if (filters.category) where.category = filters.category
    if (filters.vegetarian) where.vegetarian = true

    const priceFilter = {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    }
    if (Object.keys(priceFilter).length > 0) where.price = priceFilter

    const orderBy: Prisma.ProductOrderByWithRelationInput = filters.sort === "price-asc"
        ? { price: "asc" }
        : filters.sort === "price-desc"
            ? { price: "desc" }
            : { name: "asc" }

    const products = await prisma.product.findMany({ where, orderBy })
    let salesByProduct = new Map<number, number>()
    if (filters.sort === "popular") {
        const sales = await prisma.orderProducts.groupBy({
                by: ["productId"],
                where: {
                    order: {
                        is: { status: { in: ["PAID", "SENT", "DELIVERED"] } },
                    },
                },
                _sum: { quantity: true },
            })
        salesByProduct = new Map(
            sales.map((sale) => [sale.productId, sale._sum.quantity ?? 0] as [number, number])
        )
    }
    const productsWithSales = products.map((product) => ({
        ...product,
        salesCount: salesByProduct.get(product.id) ?? 0,
        isTopSeller: false,
    }))

    if (filters.sort === "popular") {
        productsWithSales.sort((a, b) =>
            b.salesCount - a.salesCount || a.name.localeCompare(b.name, "pt-BR")
        )
        if (productsWithSales[0]?.salesCount) productsWithSales[0].isTopSeller = true
    }

    return productsWithSales
}

export const getProductsByIds = async (ids: number[]) => {
    return prisma.product.findMany({ where: { id: { in: ids } } })
}

export const getProductById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            price: true,
            ingredients: true,
            image: true,
            category: true,
            vegetarian: true,
        }
    })
    if (!product) {
        throw new Error(`Product with ID ${id} not found`)
    }
    return product
}

export const getProductByName = async (name: string) => {
    const product = await prisma.product.findFirst({
        where: { name },
        select: {
            id: true,
            name: true,
            price: true,
            ingredients: true,
            image: true,
            category: true,
            vegetarian: true,
        }
    })
    if (!product) {
        throw new Error(`Product with name ${name} not found`)
    }
    return product
}
