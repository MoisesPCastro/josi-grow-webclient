import { IProduct } from "../products/interfaces";

export
    interface ICartContextType {
    cart: IProduct[];
    addToCart: (product: IProduct) => void;
    removeFromCart: (productId: number) => void;
    isCartOpen: boolean;
    toggleCart: () => void;
}