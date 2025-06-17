"use client";

import { useCart } from '@/app/context/CardContext';
import { useState, useEffect, useRef } from 'react';
import { ContactPopup } from '../modal/ContactPopup';
import { IProduct } from '@/app/products/interfaces';

export function CartSidebar() {
    const [isContactPopupOpen, setContactPopupOpen] = useState(false);
    const { cart, isCartOpen, toggleCart, removeFromCart } = useCart();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const total = cart.reduce((sum, item) => {
        const price = Number(item.price.replace(/\D/g, '')) / 100;
        return sum + price;
    }, 0);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isCartOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                toggleCart();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                toggleCart();
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isCartOpen, toggleCart]);

    return (
        <>
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full shadow-xl transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    } transition-transform duration-300 ease-in-out z-50
  w-[75vw] max-w-sm md:w-70`}
                style={{
                    background: 'linear-gradient(to bottom, darkmagenta, #8b008b)'
                }}
            >
                <div className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center border-b border-purple-300 pb-4">
                        <h2 className="text-xl font-bold text-lime-500">Seu Carrinho</h2>
                        <button
                            onClick={toggleCart}
                            className="text-white hover:text-purple-200 text-2xl"
                            aria-label="Fechar carrinho"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mt-4 space-y-4 overflow-y-auto flex-1">
                        {cart.length === 0 ? (
                            <p className="text-purple-200">Seu carrinho está vazio</p>
                        ) : (
                            cart.map((item: IProduct, index: number) => (
                                <div key={`${item.id}-${index}`} className="flex border-b border-purple-300 pb-4">
                                    <div className="relative w-16 h-16 mr-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white">{item.name}</h3>
                                        <p className="text-sm font-bold text-lime-600">{item.price}</p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs border border-white text-red-400 rounded-full hover:text-red-300 mt-1 px-2 py-0.5 transition-colors"
                                            aria-label={`Remover ${item.name} do carrinho`}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="border-t border-purple-300 pt-4 bg-gradient-to-br from-black/100 via-black/50 to-transparent">
                            <div className="flex justify-between mb-4">
                                <span className="font-bold text-white">Total:</span>
                                <span className="font-bold text-purple-200">R$ {total.toFixed(2)}</span>
                            </div>
                            <button
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                                onClick={() => setContactPopupOpen(true)}
                                aria-label="Finalizar compra"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isContactPopupOpen && <ContactPopup onClose={() => setContactPopupOpen(false)} />}
        </>
    );
}