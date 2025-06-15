export interface IPopupProps {
    onClose: () => void;
}

export interface IFormErrors {
    name: string;
    phone: string;
}

export interface IProductEmphasis {
    id: number;
    name: string;
    imageUrl: string;
    price: string;
}

export interface IEmphasisModalProps {
    products: IProductEmphasis[];
    onDone: () => void;
}