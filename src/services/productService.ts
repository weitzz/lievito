import { prisma } from "@/lib/prisma";

export const getAllProducts = async () => {
    return await prisma.product.findMany();
};
export const getProductById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            price: true,
            ingredients: true,
            image: true,
        }
    });
    if (!product) {
        throw new Error(`Product with ID ${id} not found`);
    }
    return product;
};

export const getProductByName = async (name: string) => {
    const product = await prisma.product.findFirst({
        where: { name },
        select: {
            id: true,
            name: true,
            price: true,
            ingredients: true,
            image: true,
        }
    });
    if (!product) {
        throw new Error(`Product with name ${name} not found`);
    }
    return product;
};