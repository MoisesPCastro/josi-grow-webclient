import { IProduct } from "../products/interfaces";

export
    interface ICartContextType {
    cart: IProduct[];
    setCart: (cart: IProduct[]) => void;
    addToCart: (product: IProduct) => void;
    removeFromCart: (productId: number) => void;
    isCartOpen: boolean;
    toggleCart: () => void;
}