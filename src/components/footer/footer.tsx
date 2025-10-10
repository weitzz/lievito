import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-secondary text-primary py-4">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-center font-semibold sm:flex-row sm:text-left">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} TW-Pizzas. Todos os direitos
                    reservados.
                </p>
                <div className="flex gap-4">
                    <Link
                        href="https://github.com/weitzz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-red-500 transition"
                    >
                        <Github className="h-5 w-5" />
                        <span>GitHub</span>
                    </Link>
                    <Link
                        href="https://www.linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-red-500 transition"
                    >
                        <Linkedin className="h-5 w-5" />
                        <span>LinkedIn</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer