export interface IProduct {
    id: number;
    name: string;
    price: string;
    description: string;
    message: string;
    status: boolean;
    imageUrl: string;
    publicId: string;
}

export interface IProductForm {
    name: string;
    price: string;
    description: string;
    message: string;
    status: boolean;
    image: File;
}

export type UpdateProductDTO = Omit<IProduct, 'id' | 'imageUrl' | 'publicId'>;
