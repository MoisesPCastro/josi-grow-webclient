import { IProduct } from "../products/interfaces";

export
    interface ICartContextType {
    cart: IProduct[];
    setCart: (cart: IProduct[]) => void;
    addToCart: (product: IProduct) => void;
    removeFromCart: (productId: string) => void;
    isCartOpen: boolean;
    toggleCart: () => void;
}