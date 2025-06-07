// components/Cart/CartIcon.tsx
"use client";

import { useCart } from "@/app/context/CardContext";


export function CartIcon() {
    const { cart, toggleCart } = useCart();

    return (
        <div
            className="fixed bottom-8 right-8 bg-yellowgreen text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer z-40"
            onClick={toggleCart}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {cart.length}
                </span>
            )}
        </div>
    );
}