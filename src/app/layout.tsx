import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CardContext";
import { CartSidebar } from "@/components/cart/CartSidebar";

export const metadata: Metadata = {
  title: "Josi Glow",
  description: "Vendas de cosmédicos",
  icons: {
    icon: "/imgs/logo-josi-glow.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <html lang="pt-BR">
        <body>
          {children}
          <CartSidebar />
        </body>
      </html>
    </CartProvider>
  );
}
