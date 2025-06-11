import { IProduct, UpdateProductDTO } from "../products/interfaces";


export interface IProductFormProps {
    initialData?: IProduct | null;
    onCreate: (form: FormData) => Promise<void>;
    onUpdate: (data: UpdateProductDTO) => Promise<void>;
    onCancel: () => void;
    isCreate?: boolean;
}

