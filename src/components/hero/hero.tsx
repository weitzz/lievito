import Image from "next/image";

const Hero = () => {
    return (
        <section className=" py-10  flex flex-row items-center justify-center ">
            <div className="px-4">
                <h1 className="text-5xl text-center mb-4 font-caveat">Bem-vindo à TW-Pizzas!</h1>
                <p className="text-lg text-center">A melhor pizzaria da cidade, agora ao seu alcance.</p>
            </div>
            <Image src="/pizza-hero.png" alt="Pizza" width={600} height={700} />
        </section>
    )
}

export default Hero