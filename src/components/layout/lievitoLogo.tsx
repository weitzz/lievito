import Image from "next/image"

const LievitoLogo = ({ className = "" }: { className?: string }) => (
    <Image
        src="/lievito-logo.svg"
        alt="Lievito Pizzeria Artigianale — L'arte della vera pizza"
        width={900}
        height={520}
        className={`h-auto w-28 ${className}`}
    />
)

export default LievitoLogo
