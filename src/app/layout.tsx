import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import 'remixicon/fonts/remixicon.css'
import Cart from "@/components/cart/cart";
import { LoginDialog } from "@/components/login/loginDialog";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Lievito | Pizzeria Artigianale",
  description: "Pizzas artesanais feitas para reunir à mesa.",
  icons: "/lievito.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
        <Cart />
        <LoginDialog />
      </body>
    </html>
  );
}
