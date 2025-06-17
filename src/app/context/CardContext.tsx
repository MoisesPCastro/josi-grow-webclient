"use client";

import { createContext, useContext, useState } from 'react';
import { IProduct } from '../products/interfaces';
import { ICartContextType } from './intefece';

const CartContext = createContext<ICartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<IProduct[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product: IProduct) => {
        setCart([...cart, product]);
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, isCartOpen, toggleCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};