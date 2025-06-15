export interface IProduct {
    id: number;
    name: string;
    price: string;
    description: string;
    message: string;
    status: boolean;
    imageUrl: string;
    publicId: string;
    emphasis: boolean;
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

export interface IProductsFile {
    products: IProduct[];
    orderBy: number[];
}
