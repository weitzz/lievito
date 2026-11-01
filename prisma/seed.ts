const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient()
async function main() {
    const pizzas = [
        {
            id: 1,
            name: 'Calabresa com Cebola',
            price: 42.9,
            image: 'calabresa.png',
            ingredients: 'Calabresa, cebola, mussarela, molho de tomate',
            category: 'Tradicionais',
            vegetarian: false,
        },
        {
            id: 2,
            name: 'Margherita',
            price: 39.9,
            image: 'margherita.png',
            ingredients: 'Mussarela, tomate, manjericão, molho de tomate',
            category: 'Vegetarianas',
            vegetarian: true,
        },
        {
            id: 3,
            name: 'Quatro Queijos',
            price: 47.5,
            image: 'quatro-queijos.png',
            ingredients: 'Mussarela, parmesão, gorgonzola, provolone, molho de tomate',
            category: 'Especiais',
            vegetarian: true,
        },
        {
            id: 4,
            name: 'Pepperoni',
            price: 44.9,
            image: 'pepperoni.png',
            ingredients: 'Pepperoni, mussarela, molho de tomate',
            category: 'Tradicionais',
            vegetarian: false,
        },
        {
            id: 5,
            name: 'Portuguesa',
            price: 45.0,
            image: 'portuguesa.png',
            ingredients: 'Presunto, ovo, cebola, azeitona, mussarela, molho de tomate',
            category: 'Tradicionais',
            vegetarian: false,
        },
        {
            id: 6,
            name: 'Vegetariana',
            price: 41.5,
            image: 'vegetariana.png',
            ingredients: 'Pimentão, cebola, tomate, champignon, milho, mussarela, molho de tomate',
            category: 'Vegetarianas',
            vegetarian: true,
        }
    ];


    for (let pizza of pizzas) {
        await prisma.product.upsert({
            where: { id: pizza.id },
            update: {
                category: pizza.category,
                vegetarian: pizza.vegetarian,
                image: pizza.image,
            },
            create: {
                name: pizza.name,
                price: pizza.price,
                image: pizza.image,
                ingredients: pizza.ingredients,
                category: pizza.category,
                vegetarian: pizza.vegetarian
            }
        });
    }
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
