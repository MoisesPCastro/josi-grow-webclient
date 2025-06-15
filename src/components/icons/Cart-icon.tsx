// components/cart/CartFloatingButton.tsx
"use client";

import { useCart } from "@/app/context/CardContext";
import './cart-icon.css';

export function CartFloatingButton() {
    const { cart, toggleCart } = useCart();

    if (!isHomePage()) return null;

    return (
        <button
            aria-label="Abrir carrinho de compras"
            className="cart-floating-button"
            onClick={toggleCart}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cart-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            {cart.length > 0 && (
                <span className="cart-badge">
                    {cart.length}
                </span>
            )}
        </button>
    );
}

function isHomePage() {
    return typeof window !== 'undefined' && window.location.pathname === '/';
}